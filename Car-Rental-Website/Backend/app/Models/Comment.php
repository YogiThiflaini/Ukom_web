<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'firstname',
        'lastname',
        'email',
        'car_id',
        'komentar',
    ];

    // Relasi dengan model User (Setiap komentar dimiliki oleh user)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi dengan model Car (Setiap komentar terkait dengan mobil tertentu)
    public function car()
    {
        return $this->belongsTo(Car::class);
    }
}
