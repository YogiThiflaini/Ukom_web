<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopupHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'topup_amount',
        'topup_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
