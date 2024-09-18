<?php

use Midtrans\Snap;
use Midtrans\Config;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarController;
use App\Http\Controllers\RentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\TopupHistoryController;
use App\Http\Controllers\AccountRequestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('signup', [UserController::class, 'signup']);

Route::post('login', [UserController::class, 'login']);

Route::get('users', [UserController::class, 'index']);

Route::get('/users/{user_id}', [UserController::class, 'getUserProfile']);

Route::get('cars', [CarController::class, 'index']);

Route::get('cars/{id}', [CarController::class, 'show']);

Route::get('logout', [UserController::class, 'logout']);

Route::get('rents', [RentController::class, 'index']);

Route::post('rents', [RentController::class, 'store']);

Route::post('cars', [CarController::class, 'store']);

Route::get('/users/{user_id}/rents', [RentController::class, 'getUserRents']);

Route::post('/user/{user_id}', [UserController::class, 'updateProfile']);

Route::delete('/cars/{id}', [CarController::class, 'destroy']);
Route::delete('/rents/{id}', [RentController::class, 'destroy']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

Route::post('reset-password', [UserController::class, 'resetPassword']);
Route::put('cars/{id}', [CarController::class, 'update']);
Route::put('rents/{id}', [RentController::class, 'update']);
Route::put('users/{id}', [UserController::class, 'update']);

Route::put('rents/{id}/cancel', [RentController::class, 'cancelRent']);

Route::get('/verify-email/{token}', [UserController::class, 'verifyEmail']);

Route::post('/resend-verification', [UserController::class, 'resendVerification']);
Route::post('/users/{user_id}/update-balance', [UserController::class, 'updateBalance']);
Route::post('/users/{user_id}/confirm-topup', [UserController::class, 'confirmTopUp']);

Route::post('/rents/{rent}/pay', [RentController::class, 'pay']);
Route::put('/users/{user_id}/update-banned-status', [UserController::class, 'updateBannedStatus']);

Route::post('/rents/pay-all', [RentController::class, 'payAll']);

Route::get('topups', [TopupHistoryController::class, 'getTopups']);
Route::post('topups', [TopupHistoryController::class, 'createTopup']);
Route::get('topups/user/{userId}', [TopupHistoryController::class, 'getUserTopupHistory']);

Route::post('users/{user_id}/send-topup-token', [UserController::class, 'sendTopUpToken']);
Route::post('users/{user_id}/validate-topup-token', [UserController::class, 'validateTopUpToken']);

Route::get('requests', [AccountRequestController::class, 'index']);
Route::get('/account-requests/{id}', [AccountRequestController::class, 'show']);
Route::post('/account-requests', [AccountRequestController::class, 'store']);
Route::put('/requests/{id}/approval', [AccountRequestController::class, 'updateApproval']);
Route::delete('/historys/{id}', [TopupHistoryController::class, 'destroy']);
Route::delete('/Requests/{id}', [AccountRequestController::class, 'destroy']);

Route::get('cars/{car_id}/comments', [CommentController::class, 'getComments']);
Route::post('comments', [CommentController::class, 'store']);
Route::delete('comments/{id}', [CommentController::class, 'destroy']);
Route::put('/comments/{id}', [CommentController::class, 'update']);