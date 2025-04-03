<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $data = json_encode([
            "users" => 4200,
            "current_users" => 100,
            "active_users" => 685,
        ]);
        $final_data = json_decode($data);
        return response()->json([
            'status' => true,
            'statusCode' => 200,
            'message' => 'Details get successfully',
            'data' => $final_data
        ]);
    }
}
