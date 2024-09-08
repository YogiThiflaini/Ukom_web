<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\AccountRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\ApprovalStatusMail;

class AccountRequestController extends Controller
{
    // Membuat permintaan aktivasi akun
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'email' => 'required|email|exists:users,email', // Memastikan email ada di tabel users
            'description' => 'nullable|string'
        ]);

        // Ambil user berdasarkan email
        $user = User::where('email', $request->input('email'))->first();

        // Jika user ditemukan, buat permintaan aktivasi akun
        $accountRequest = AccountRequest::create([
            'user_id' => $user->id, // Mengambil user_id dari user yang ditemukan
            'email' => $user->email,
            'description' => $request->input('description'),
            'approval' => '0' // Status awal belum direspons
        ]);

        return response()->json(['success' => true, 'data' => $accountRequest], 201);
    }

public function updateApproval(Request $request, $id)
{
    // Log request ID and incoming approval status
    Log::info("Updating approval status for request ID: $id");
    
    // Find the request by ID
    $accountRequest = DB::table('account_requests')->where('id', $id)->first();

    // Check if request exists
    if (!$accountRequest) {
        return response()->json(['message' => 'Request not found'], 404);
    }

    // Validate input approval status
    $request->validate([
        'approval' => 'required|integer|in:1,2',
    ]);

    // Update approval status
    DB::table('account_requests')->where('id', $id)->update([
        'approval' => $request->input('approval'),
    ]);

    // If approval is set to 1, update user's banned status
    if ($request->input('approval') == 1) {
        DB::table('users')->where('id', $accountRequest->user_id)->update([
            'banned' => 0,
        ]);

        $statusMessage = 'Permintaan telah kami setujui! Akun DAYstore anda kini aktif';
    } elseif ($request->input('approval') == 2) {
        $statusMessage = 'Mohon maaf permintaan kami tolak atas alasan tertentu! Anda belum bisa untuk login DAYstore';
    } else {
        $statusMessage = '';
    }

    // Send email notification
    if ($statusMessage) {
        Mail::to($accountRequest->email)->send(new ApprovalStatusMail($statusMessage));
    }

    // Fetch updated request data
    $updatedRequest = DB::table('account_requests')->where('id', $id)->first();

    // Log the updated request data
    Log::info("Updated request data:", (array)$updatedRequest);

    // Return success response
    return response()->json([
        'message' => 'Approval status updated successfully.',
        'data' => $updatedRequest,
    ]);
}

    // Menampilkan semua permintaan aktivasi akun
    public function index(Request $request)
{
    try {
        // Ambil semua permintaan tanpa join dengan tabel users
        $accountRequests = AccountRequest::all();

        return response()->json(['success' => true, 'data' => $accountRequests], 200);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'An error occurred while fetching the account requests.',
            'message' => $e->getMessage(),
        ], 500);
    }
}


    // Menampilkan detail satu permintaan
    public function show($id)
    {
        $accountRequest = AccountRequest::with('user')->findOrFail($id);

        return response()->json(['success' => true, 'data' => $accountRequest], 200);
    }
}
