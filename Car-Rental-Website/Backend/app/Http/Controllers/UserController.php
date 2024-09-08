<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Mail\TopUpToken;
use App\Mail\VerifyEmail;
use App\Models\TopupHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    public function index()
    {
        $users = User::select('id', 'firstname', 'lastname', 'telephone', 'email','level', 'saldo_dana','profile_photo', 'email_verified_at','created_at','alamat','banned')
            ->get();
        return response()->json(['success' => true, 'data' => $users], 200);
    }

    public function signup(Request $request)
{
    // Validasi input termasuk profile photo
    $validated = $request->validate([
        'firstname' => 'required|min:2|max:20',
        'lastname' => 'required|min:2|max:20',
        'telephone' => 'required|min:5|max:30',
        'email' => 'required|email|unique:users',
        'password' => 'required',
        'alamat'=>'required',
        'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validasi profile photo
    ]);

    echo "ini passwordnya ". $request->password;

    if ($validated) {
        $verificationToken = mt_rand(100000, 999999);

        // Proses upload profile photo jika ada
        $profilePhotoUrl = null;
        if ($request->hasFile('profile_photo')) {
            // Simpan gambar ke direktori 'public/upload' dengan nama yang unik
            $profilePhotoName = time() . '_' . $request->file('profile_photo')->getClientOriginalName();
            $request->file('profile_photo')->move(public_path('upload'), $profilePhotoName);

            // Simpan URL gambar
            $profilePhotoUrl = url('upload/' . $profilePhotoName);
        }

        DB::table('users')->insert([
            'firstname' => $request->input('firstname'),
            'lastname' => $request->input('lastname'),
            'telephone' => $request->input('telephone'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'level' => 'user',
            'alamat'=>$request->input('alamat'),
            'email_verification_code' => $verificationToken,
            'saldo_dana' => 0,  // Inisialisasi saldo_dana dengan 0
            'topup_token' => null,  // Token bisa diisi saat proses verifikasi
            'profile_photo' => $profilePhotoUrl,  // Simpan URL dari foto profil
            'created_at' => now()
        ]);

        try {
            Mail::to($request->email)->send(new VerifyEmail($verificationToken));
        } catch (\Exception $e) {
            return response(['message' => 'Gagal mengirim email verifikasi, coba lagi nanti.'], 500);
        }

        return response(['message' => 'Silahkan cek email untuk verifikasi'], 201);
    }
}

    public function sendTopUpToken(Request $request, $user_id)
{
    $user = User::find($user_id);
    
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Generate random 6-digit token
    $token = rand(100000, 999999);

    // Save token and its expiration timestamp
    $user->topup_token = $token;
    $user->token_expires_at =Carbon::now()->addMinutes(15); // Waktu saat ini ditambah 15 menit
    // 15 minutes from now
    $user->save();

    // Send token via email
    Mail::to($user->email)->send(new TopUpToken($token));

    return response()->json(['message' => 'Token sent to email'], 200);
}

public function validateTopUpToken(Request $request, $user_id)
{
    $user = User::find($user_id);

    if (!$user || !$request->has('token')) {
        return response()->json(['message' => 'Invalid request'], 400);
    }

    // Validate token
    if ($request->token != $user->topup_token) {
        return response()->json(['message' => 'Invalid token'], 401);
    }

    // Check token expiration
    if (Carbon::now()->greaterThan($user->token_expires_at)) {
        return response()->json(['message' => 'Token expired'], 401);
    }

    // Clear token after successful validation
    $user->topup_token = null;
    $user->token_expires_at = null;
    $user->save();

    return response()->json(['message' => 'Token valid'], 200);
}

    

    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');
        
        // Validasi input
        $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Cari pengguna berdasarkan email
        $user = User::where('email', $email)->first();

        // Logika kesalahan
        if (!$user) {
            Log::error('User not found: ' . $email);
            return response()->json(['success' => false, 'message' => 'Login gagal, akun mungkin belum terdaftar'], 404);
        }

         // Periksa apakah pengguna diblokir
        if ($user->banned == 1) {
            Log::warning('Login attempt for banned user: ' . $email);
            return response()->json(['success' => false, 'message' => 'Akun Anda telah diblokir oleh admin'], 402);
        }

        // Periksa apakah email telah diverifikasi
        if (!$user->email_verified_at) {
            Log::info('Email not verified for: ' . $email);
            return response()->json(['success' => false, 'message' => 'akun belum terverifikasi'], 403);
        }

        // Periksa kecocokan password
        if (!Hash::check($password, $user->password)) {
            Log::warning('Incorrect password attempt for: ' . $email);
            return response()->json(['success' => false, 'message' => 'Password salah, silahkan coba lagi'], 401);
        }

        // Jika semua pemeriksaan lolos
        session(['id' => $user->id, 'firstname' => $user->firstname, 'lastname' => $user->lastname, 'telephone' => $user->telephone, 'email' => $user->email, 'alamat' => $user->alamat]);

        return response()->json(['success' => true, 'message' => 'Login berhasil', 'data' => $user], 200);
    }

    public function getUserProfile($user_id)
    {
        // Ambil data pengguna berdasarkan user_id
        $user = User::find($user_id);

        // Periksa apakah pengguna ditemukan
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        // Kirimkan respons JSON dengan data pengguna
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function logout()
    {
        session()->flush();
        Auth::logout();
        return response()->json(['message' => 'Logout berhasil']);
    }

    public function resetPassword(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email|exists:users,email',
        'new_password' => 'required|confirmed',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()->first(),
        ], 400);
    }

    $user = User::where('email', $request->email)->first();
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not found',
        ], 404);
    }

    $user->password = Hash::make($request->new_password);
    $user->save();

    return response()->json([
        'success' => true,
        'message' => 'Password successfully updated',
    ], 200);
}

    public function updateProfile(Request $request, $user_id)
    {
        // Temukan pengguna
        $user = User::find($user_id);
    
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found!'], 404);
        }
    
        // Validasi data input
        $validated = $request->validate([
            'firstname' => 'required|min:2|max:20',
            'lastname' => 'required|min:2|max:20',
            'telephone' => 'required|min:5|max:30',
            'alamat' => 'required|max:40',
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // Validasi foto profil
        ]);
    
        // Update data pengguna
        DB::table('users')->where('id', $user_id)->update([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'telephone' => $request->telephone,
            'alamat' => $request->alamat,
        ]);
    
        // Simpan foto profil jika ada
        if ($request->hasFile('profile_photo')) {
            // Hapus foto profil lama jika ada
            if ($user->profile_photo) {
                $oldFilePath = public_path('upload/' . basename($user->profile_photo));
                if (file_exists($oldFilePath)) {
                    unlink($oldFilePath);
                }
            }
    
            // Simpan gambar ke direktori 'public/upload' dengan nama yang unik
            $profilePhotoName = time() . '_' . $request->file('profile_photo')->getClientOriginalName();
            $request->file('profile_photo')->move(public_path('upload'), $profilePhotoName);
    
            // Simpan URL gambar
            $profilePhotoUrl = url('upload/' . $profilePhotoName);
    
            // Update URL foto profil di database
            DB::table('users')->where('id', $user_id)->update([
                'profile_photo' => $profilePhotoUrl
            ]);
        }
    
        // Ambil data terbaru pengguna
        $user = User::find($user_id);
    
        return response()->json([
            'success' => true,
            'message' => 'Profile berhasil diupdate!',
            'data' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validate input data
        $validatedData = $request->validate([
            // Uncomment these lines if you want to validate these fields
            // 'firstname' => 'required',
            // 'lastname' => 'required',
            // 'telephone' => 'required',
            // 'email' => 'required',
            'level' => 'required',
            'saldo_dana' => 'nullable|numeric|min:0', // Add validation for saldo_dana
        ]);

        // Prepare the update data
        $updateData = [
            // Uncomment these lines if you want to update these fields
            // 'firstname' => $request->firstname,
            // 'lastname' => $request->lastname,
            // 'telephone' => $request->telephone,
            // 'email' => $request->email,
            'level' => $request->level,
        ];

        // Update saldo_dana if provided
        if ($request->has('saldo_dana')) {
            $updateData['saldo_dana'] = $request->saldo_dana;
        }

        // Update user record in the database
        DB::table('users')->where('id', $id)->update($updateData);

        // Return a response
        return response()->json([
            'data' => $user,
            'message' => 'User berhasil diupdate!',
        ]);
    }

    // UserController.php

    public function updateBannedStatus(Request $request, $id)
    {
        // Temukan user berdasarkan ID
        $user = User::findOrFail($id);
    
        // Validasi input
        $request->validate([
            'banned' => 'required',
        ]);
    
        // Update status banned
        DB::table('users')->where('id', $id)->update([
            'banned' => $request->input('banned'),
        ]);    
    
        return response()->json([
            'message' => 'User banned status updated successfully',
            'user' => $user,
        ]);
    }


   public function verifyEmail($token)
{
    $tokens = $token;
    
    // Mencari user berdasarkan token verifikasi email
    $user = User::where('email_verification_code', $tokens)->first();

    // Jika user tidak ditemukan, kembalikan respons dengan pesan error
    if (!$user) {
        return response()->json(['message' => 'Token tidak valid'], 404);
    }

    // Update user: set email_verified_at menjadi waktu sekarang dan hapus kode verifikasi
    $user->update([
        'email_verified_at' => now(),
        'email_verification_code' => null
    ]);

    // Buat token baru untuk user
    $token = $user->createToken('main')->plainTextToken;

    // Kembalikan respons dengan user dan token
    return response()->json(compact('user', 'token'));
}

    public function resendVerification(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || $user->email_verified_at) {
            return response()->json(['message' => 'Pengguna tidak ditemukan atau sudah terverifikasi'], 404);
        }

        $verificationToken = mt_rand(100000, 999999);
        $user->update([
            'email_verification_code' => $verificationToken,
        ]);

        try {
            Mail::to($user->email)->send(new VerifyEmail($verificationToken));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengirim email verifikasi, coba lagi nanti.'], 500);
        }

        return response()->json(['message' => 'Kode OTP telah dikirim ulang ke email Anda.']);
    }
    public function updateBalance(Request $request, $user_id)
    {
        // Validasi input
        $validatedData = $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        // Temukan pengguna berdasarkan ID
        $user = User::findOrFail($user_id);

        // Perbarui saldo pengguna
        $user->saldo_dana += $validatedData['amount'];
        $user->save();

        // Simpan riwayat top-up
        TopupHistory::create([
            'user_id' => $user->id,
            'topup_amount' => $validatedData['amount'],
            'topup_date' => now(),
        ]);

        // Return response dengan data pengguna yang diperbarui
        return response()->json([
            'data' => $user,
            'message' => 'Saldo berhasil diperbarui dan riwayat top-up telah dicatat.'
        ], 200);
    }


    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['success' => true, 'message' => 'User Berhasil dihapus']);
    }

}