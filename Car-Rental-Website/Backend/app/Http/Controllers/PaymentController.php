<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\User;
use App\Models\TopupHistory;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\TopUpMail;
use App\Mail\TopUpSuccessMail;

class PaymentController extends Controller
{
    public function create(Request $request)
    {
        // Validate input
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'jumlah_saldo' => 'required|numeric|min:10000',
            'metode_pembayaran' => 'required|string',
            'card_serial' => 'nullable|string|min:12',
            'nama_bank' => 'nullable|string',
        ]);

        // Generate unique token
        $token = Str::random(10);

        // Save top-up data with admin approval and token verification set to 0 initially
        $payment = Payment::create(array_merge($validatedData, [
            'token' => $token,
            'token_verified' => 0, // Initially, token is not verified
            'admin_approval' => 0,  // Initially, admin approval is not granted
        ]));

        // Send email with token
        Mail::to(User::find($validatedData['user_id'])->email)
            ->send(new TopUpMail($token));

        return response()->json([
            'message' => 'Top-up berhasil, token telah dikirim.',
            'data' => ['token' => $token],
        ], 200);
    }

    public function verifyToken(Request $request)
{
    $validatedData = $request->validate([
        'token' => 'required|string',
    ]);

    // Find the payment record with the provided token
    $payment = Payment::where('token', $validatedData['token'])->first();

    // Check if the token matches
    if (!$payment) {
        return response()->json(['message' => 'Token tidak valid'], 400);
    }

    // Check if the token has already been verified
    if ($payment->token_verified == 1) {
        return response()->json(['message' => 'Token sudah diverifikasi'], 400);
    }

    // Update the token_verified status
    $payment->token_verified = 1;
    $payment->save();

    return response()->json(['message' => 'Token berhasil diverifikasi'], 200);
}


public function adminApproval($id, Request $request)
{
    $validatedData = $request->validate([
        'admin_approval' => 'required|integer', // Expect admin_approval in the request (1 for approve, 2 for reject)
    ]);

    // Find the payment record using the provided id
    $payment = Payment::find($id);

    // If no payment is found or token_verified is not 1, return an error
    if (!$payment || $payment->token_verified !== 1) {
        return response()->json(['message' => 'Top-up belum diverifikasi atau tidak valid'], 400);
    }

    // Update the admin_approval status
    $payment->admin_approval = $validatedData['admin_approval'];
    $payment->save();

    // Handle approval (admin_approval = 1)
    if ($validatedData['admin_approval'] == 1) {
        $user = User::findOrFail($payment->user_id);
        $user->saldo_dana += $payment->jumlah_saldo;
        $user->save();

        // Create a top-up history record
        TopupHistory::create([
            'user_id' => $user->id,
            'topup_amount' => $payment->jumlah_saldo,
            'topup_date' => now(),
        ]);

        // Send a confirmation email to the user
        Mail::to($user->email)->send(new TopUpSuccessMail());

        return response()->json([
            'message' => 'Top-up disetujui dan saldo berhasil ditambahkan',
            'data' => $user,
        ], 200);
    }
    // Handle rejection (admin_approval = 2)
    elseif ($validatedData['admin_approval'] == 2) {
        return response()->json([
            'message' => 'Top-up ditolak',
        ], 200);
    }

    return response()->json(['message' => 'Status admin_approval diperbarui'], 200);
}


    public function index()
    {
        // Retrieve all top-ups and join with users to get their emails
        $payments = Payment::join('users', 'payments.user_id', '=', 'users.id')
            ->select('payments.*', 'users.email')
            ->get();

        return response()->json($payments);
    }
}
