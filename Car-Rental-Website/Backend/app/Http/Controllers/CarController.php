<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CarController extends Controller
{
    public function index()
    {
        $cars = Car::select('id', 'photo1', 'photo2', 'brand', 'model', 'fuel_type', 'price', 'gearbox', 'available')
            ->get();
        return response()->json(['success' => true, 'data' => $cars], 200);
    }

    public function show($id)
    {
        $car = DB::table('cars')->where('id', $id)->get();
        return response()->json(['success' => true, 'data' => $car], 200);
    }
    
    public function store(Request $request)
    {
        // Validasi request
        $request->validate([
            'photo1' => 'required',
            'photo2' => 'required',
            'brand' => 'required',
            'model' => 'required',
            'gearbox' => 'required',
            'fuel_type' => 'required',
            'price' => 'required|numeric',
            'available' => 'required|numeric',
        ]);
    
        // Simpan gambar ke direktori 'public/upload' dengan nama yang unik
        $photo1Name = time() . '_' . $request->file('photo1')->getClientOriginalName();
        $photo2Name = time() . '_' . $request->file('photo2')->getClientOriginalName();
        $request->file('photo1')->move(public_path('upload'), $photo1Name);
        $request->file('photo2')->move(public_path('upload'), $photo2Name);
    
        // Simpan data mobil ke dalam tabel 'cars'
        DB::table('cars')->insert([
            'photo1' => url('upload/' . $photo1Name),
            'photo2' => url('upload/' . $photo2Name),
            'brand' => $request->brand,
            'model' => $request->model,
            'gearbox' => $request->gearbox,
            'fuel_type' => $request->fuel_type,
            'price' => $request->price,
            'available' => $request->available,
        ]);
    
        // Beri respons sukses
        return response()->json(['success' => true, 'data' => 'okok'], 201);
    }

    public function update(Request $request, $id)
    {
        $car = Car::findOrFail($id); 

        $validatedData = $request->validate([
            'brand' => 'required',
            'model' => 'required',
            'gearbox' => 'required',
            'fuel_type' => 'required',
            'price' => 'required',
            'available' => 'required',
        ]);

        DB::table('cars')->where('id', $id)->update([
            'brand' => $request->input('brand'),
            'model' => $request->input('model'),
            'gearbox' => $request->input('gearbox'),
            'fuel_type' => $request->input('fuel_type'),
            'price' => $request->input('price'),
            'available' => $request->input('available')
        ]);

        $car ->save();
        $updatecar = Car::findOrFail($id);

        return response()->json([
            'data' => $updatecar,
            'message' => 'Car updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $car = Car::find($id);

        if (!$car) {
            return response()->json(['success' => false, 'message' => 'Mobil tidak ditemukan'], 404);
        }

        $car->delete();

        return response()->json(['success' => true, 'message' => 'Mobil berhasil dihapus!']);
    }
}