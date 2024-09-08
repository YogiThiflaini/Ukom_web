<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'token',
        'jumlah_saldo',
        'metode_pembayaran',
        'card_serial',
        'nama_bank',
    ];
}
