<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\TopupHistory;
use Illuminate\Http\Request;

class TopupHistoryController extends Controller
{

// TopupController.php

public function getTopups(Request $request)
{
    try {
        // Fetch all topup history records with user details
        $topups = TopupHistory::join('users', 'topup_histories.user_id', '=', 'users.id')
            ->select('topup_histories.*', 'users.firstname', 'users.lastname', 'users.email')
            ->get();

        return response()->json($topups);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'An error occurred while fetching the top-up history.',
            'message' => $e->getMessage(),
        ], 500);
    }
}


// TopupController.php

public function createTopup(Request $request)
{
    // Validasi input
    $validated = $request->validate([
        'user_id' => 'required|integer|exists:users,id',
        'topup_amount' => 'required|numeric|min:0',
    ]);

    // Membuat entri top-up baru
    $topup = TopupHistory::create([
        'user_id' => $validated['user_id'],
        'topup_amount' => $validated['topup_amount'],
        'topup_date' => now(), // Menetapkan tanggal top-up ke waktu saat ini
    ]);

    return response()->json($topup, 201);
}

public function getTopupsByUserId($userId)
{
    // Validasi jika user_id ada di tabel users
    if (!\App\Models\User::find($userId)) {
        return response()->json(['error' => 'User not found'], 404);
    }

    // Mengambil semua entri top-up untuk user tertentu
    $topups = TopupHistory::where('user_id', $userId)->get();
    
    return response()->json($topups);
}

public function getUserTopupHistory($user_id)
{
    // Ambil semua riwayat top-up berdasarkan user_id
    $topupHistory = TopupHistory::where('user_id', $user_id)->orderBy('topup_date', 'desc')->get();

    // Return response dengan data riwayat top-up
    return response()->json($topupHistory, 200);
}

public function destroy($id)
{
    $rent = TopupHistory::find($id);

    if (!$rent) {
        return response()->json(['success' => false, 'message' => 'History topup tidak ditemukan'], 404);
    }

    $rent->delete();

    return response()->json(['success' => true, 'message' => 'History topup berhasil dihapus!']);
}


}