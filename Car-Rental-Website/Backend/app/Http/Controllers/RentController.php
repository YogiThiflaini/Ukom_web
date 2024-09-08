<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Rent;
use App\Models\User;

class RentController extends Controller
{
    // Get all rents
    public function index()
    {
        try {
            // Mengambil data dari tabel rents dan users dengan join
            $rents = DB::table('rentals')
                ->join('users', 'rentals.user_id', '=', 'users.id')
                ->select('rentals.*', 'users.email', 'users.saldo_dana')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $rents
            ]);
        } catch (\Exception $e) {
            // Menangani error dan mengembalikan response error
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    // Ubah visibilitas metode getStatus
    protected function getStatus(Rent $rent)
    {
        if ($rent->pays == 0) {
            return 'belum_bayar';
        } elseif ($rent->pays < $rent->price) {
            return 'belum_lunas';
        } else {
            return 'lunas';
        }
    }


    // Create a new rent
    public function store(Request $request)
{
    // Validasi input
    $request->validate([
        'rental_date' => 'required|date',
        'return_date' => 'required|date|after_or_equal:rental_date',
        'price' => 'required|numeric',
        'user_id' => 'required|exists:users,id',
        'car_id' => 'required|exists:cars,id',
        // Tidak memvalidasi kolom status karena akan diatur secara default
    ]);

    // Check if rental_date and return_date are the same or the rental duration is 1 day
    if ($request->input('rental_date') === $request->input('return_date') ||
        (strtotime($request->input('return_date')) - strtotime($request->input('rental_date')) <= 86400)) {
        
        // Set the price to car price for 1 day if rental_date and return_date are the same or the rental duration is 1 day
        $carPrice = DB::table('cars')->where('id', $request->input('car_id'))->value('price');
        $request->merge(['price' => $carPrice]);
    }

    // Cek apakah rentang tanggal dan id mobil sudah ada sebelumnya
    $existingRent = DB::table('rentals')
        ->where('car_id', $request->input('car_id'))
        ->where(function ($query) use ($request) {
            $query->where('rental_date', '>=', $request->input('rental_date'))
                ->where('rental_date', '<=', $request->input('return_date'))
                ->orWhere('return_date', '>=', $request->input('rental_date'))
                ->where('return_date', '<=', $request->input('return_date'))
                ->orWhere(function ($query) use ($request) {
                    $query->where('rental_date', '<', $request->input('rental_date'))
                        ->where('return_date', '>', $request->input('return_date'));
                });
        })
        ->first();

    // Jika sudah ada, kembalikan pesan kesalahan
    if ($existingRent) {
        return response()->json(['success' => false, 'message' => 'Tanggal dan mobil sudah dipesan orang lain.'], 422);
    }

    // Jika tidak ada, lakukan penyisipan ke dalam tabel rentals
    $rent = DB::table('rentals')->insert([
        'rental_date' => $request->input('rental_date'),
        'return_date' => $request->input('return_date'),
        'price' => $request->input('price'),
        'user_id' => $request->input('user_id'),
        'car_id' => $request->input('car_id'),
        'status' => 'belum_bayar',
        'returned'=> 'belum_diambil',
        'created_at'=> now()
    ]);

    // Update kolom 'available' menjadi 0 pada tabel 'cars'
    DB::table('cars')
        ->where('id', $request->input('car_id'))
        ->update(['available' => 0]);

    // Berikan respons berhasil
    return response()->json(['success' => true, 'data' => $rent], 201);
}

    // Get rents of a specific user
    public function getUserRents($user_id)
{
    // Ambil pengguna termasuk sewa dan mobil terkait
    $user = User::with('rents.car')->find($user_id);

    // Periksa apakah pengguna ditemukan
    if (!$user) {
        return response()->json(['success' => false, 'message' => 'User not found'], 404);
    }

    // Ambil saldo pengguna
    $saldo_dana = $user->saldo_dana;

    // Ambil sewa pengguna
    $rents = $user->rents;

    // Tambahkan saldo_dana ke setiap item sewa
    $rentsWithBalance = $rents->map(function($rent) use ($saldo_dana) {
        $rent->saldo_dana = $saldo_dana;
        return $rent;
    });

    // Kirimkan respons JSON
    return response()->json([
        'success' => true,
        'data' => $rentsWithBalance
    ]);
}

    public function update(Request $request, $id)
    {
        $rent = Rent::findOrFail($id);

        // Validasi input
        $validatedData = $request->validate([
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:belum_bayar,belum_lunas,lunas',
            'pays' => 'nullable|numeric|min:0',
            'returned' => 'required|in:belum_diambil,sedang_disewa,sudah_kembali'
        ]);

        $price = $request->input('price');
        $status = $request->input('status');
        $pays = $request->input('pays', 0);
        $returned = $request->input('returned');

        // Logika untuk mengupdate kolom 'pays' berdasarkan status
        if ($status === 'lunas') {
            $pays = $price;
        } elseif ($status === 'belum_bayar') {
            $pays =0;
        } elseif ($status === 'belum_lunas') {
            if ($pays < 0 || $pays > $price) {
                return response()->json(['message' => 'Nilai pays harus lebih dari 0 dan kurang dari harga'], 400);
            }
        }

        // Update rental
        DB::table('rentals')->where('id', $id)->update([
            'price' => $price,
            'status' => $status,
            'pays' => $pays,
            'returned' => $returned,
        ]);

        // Fetch updated rental
        $updatedRent = Rent::findOrFail($id);

        return response()->json([
            'data' => $updatedRent,
            'message' => 'Rental berhasil diupdate!',
        ]);
    }

    // app/Http/Controllers/RentController.php
    // app/Http/Controllers/RentController.php

    // Metode pembayaran
    public function pay(Request $request, $id)
    {
        // Validasi input
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0', // Pastikan jumlah pembayaran adalah angka positif
        ]);

        // Temukan rental dan pengguna
        $rent = Rent::find($id);
        $user = User::find($rent->user_id);

        if (!$rent || !$user) {
            return response()->json(['message' => 'Rent or user not found'], 404);
        }

        // Hitung sisa pembayaran
        $remainingAmount = $rent->price - $rent->pays;
        $amountToPay = min($request->amount, $remainingAmount);

        // Periksa saldo pengguna
        if ($user->saldo_dana < $amountToPay) {
            return response()->json(['message' => 'Insufficient balance'], 400);
        }

        // Update saldo pengguna
        $user->saldo_dana -= $amountToPay;
        $user->save();

        // Update pembayaran dan status
        $rent->pays += $amountToPay;

        // Logika untuk mengatur status berdasarkan pembayaran
        if ($rent->pays == $rent->price) {
            $rent->status = 'lunas';
        } elseif ($rent->pays > 0 && $rent->pays < $rent->price) {
            $rent->status = 'belum_lunas';
        }

        $rent->save();

        return response()->json([
            'message' => 'Payment successful',
            'data' => [
                'rent' => $rent,
                'user' => $user,
            ]
        ], 200);
    }

    public function payAll(Request $request)
    {
        $user = User::find($request->user_id);
        $unpaidRents = $request->unpaidRents;

        $totalAmountToPay = 0;

        foreach ($unpaidRents as $rent) {
            $amountDue = $rent['price'] - $rent['pays'];
            $totalAmountToPay += $amountDue;
        }

        if ($totalAmountToPay > $user->saldo_dana) {
            return response()->json(['message' => 'Saldo tidak cukup'], 400);
        }

        foreach ($unpaidRents as $rent) {
            $rental = Rent::find($rent['id']);
            $rental->pays = $rental->price;
            $rental->status = 'lunas';
            $rental->save();
        }

        $user->saldo_dana -= $totalAmountToPay;
        $user->save();

        $updatedRents = Rent::where('user_id', $user->id)->get();

        return response()->json([
            'updatedRents' => $updatedRents,
            'newBalance' => $user->saldo_dana
        ], 200);
    }

    
public function cancelRent($id)
{
    // Cari rental berdasarkan ID
    $rent = Rent::find($id);

    // Periksa apakah rental ditemukan
    if (!$rent) {
        return response()->json(['message' => 'Rent not found'], 404);
    }

    // Perbarui kolom cancel menjadi 1
    $rent->cancel = 1;
    $rent->save();

    // Update kolom available pada tabel cars
    $affected = DB::table('cars')
        ->where('id', $rent->car_id)
        ->update(['available' => 1]);

    // Periksa apakah mobil ditemukan dan diperbarui
    if ($affected === 0) {
        return response()->json(['message' => 'Car not found or already updated'], 404);
    }

    return response()->json(['message' => 'Rent successfully canceled and car status updated'], 200);
}


    public function destroy($id)
    {
        $rent = Rent::find($id);

        if (!$rent) {
            return response()->json(['success' => false, 'message' => 'Rental tidak ditemukan'], 404);
        }

        $rent->delete();

        return response()->json(['success' => true, 'message' => 'Rental berhasil dihapus!']);
    }
}
