<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    // Fungsi untuk mengambil komentar berdasarkan car_id
    public function getComments($car_id)
    {
        $comments = Comment::where('car_id', $car_id)->get();
        return response()->json($comments);
    }

    // Fungsi untuk membuat komentar baru
    public function store(Request $request)
{
    // Validasi input
    $request->validate([
        'car_id' => 'required|exists:cars,id',
        'komentar' => 'required|string',
        'email' => 'required|email', // Validasi email
    ]);

    // Temukan user_id berdasarkan email
    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'User tidak ditemukan'], 404);
    }

    // Cek jumlah komentar user untuk car_id yang sama
    $existingCommentsCount = Comment::where('user_id', $user->id)
                                    ->where('car_id', $request->car_id)
                                    ->count();

    // Jika sudah 5 komentar, kembalikan pesan error
    if ($existingCommentsCount >= 2) {
        return response()->json(['message' => 'Batas maksimal 2 komentar untuk mobil ini telah tercapai'], 403);
    }

    // Buat komentar baru jika belum mencapai batas
    $comment = new Comment();
    $comment->user_id = $user->id; // Set user_id
    $comment->firstname = $user->firstname; // Ambil firstname dari user
    $comment->lastname = $user->lastname; // Ambil lastname dari user
    $comment->email = $user->email; // Ambil email dari user
    $comment->car_id = $request->car_id;
    $comment->komentar = $request->komentar;
    $comment->save();

    return response()->json(['message' => 'Komentar berhasil ditambahkan!'], 201);
}

public function update(Request $request, $id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $comment->komentar = $request->input('komentar');
        $comment->save();

        return response()->json(['message' => 'Comment updated successfully', 'comment' => $comment]);
    }


    // Fungsi untuk menghapus komentar
    public function destroy($id)
    {
        // Menghapus komentar berdasarkan ID
        $comment = Comment::find($id);
        if ($comment) {
            $comment->delete();
            return response()->json(['message' => 'Comment deleted successfully.']);
        }
        return response()->json(['message' => 'Comment not found.'], 404);
    }
}
