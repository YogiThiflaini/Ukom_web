<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountRequest extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'email', 'description', 'approval'];

    // Relasi ke model User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
