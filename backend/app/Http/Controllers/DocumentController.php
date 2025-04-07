<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    /**
     * Display a listing of the documents
     */
    public function index(Request $request)
    {
        $per_page = $request->query('per_page', 10);
        $order_by = $request->query('order_by', 'id');
        $order_direction = strtolower($request->query('order_direction', 'desc'));
        $search_name = $request->query('search', "");
        // Validate order direction
        $order_direction = in_array($order_direction, ['asc', 'desc']) ? $order_direction : 'desc';
        $allowed_orders = ['id', 'created_at', 'updated_at', 'status'];
        $order_by = in_array($order_by, $allowed_orders) ? $order_by : 'id';

        $query = Document::query();
        if ($search_name !== "") {
            $query->where('name', 'like', '%' . $search_name . '%');
        }
        
        $docs = $query->orderBy($order_by, $order_direction)->paginate($per_page);

        return response()->json([
            'status' => true,
            'statusCode' => 200,
            'message' => "Documents retrieved successfully",
            'data' => $docs
        ], 200);
    }

    /**
     * Store a newly created document
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'document' => 'required|file',
            'current_language' => 'required|string',
            'process_language' => 'required|string',
            'status' => 'required|in:Pending,Processing,Completed,Rejected'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'statusCode' => 422,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $document = Document::create([
            'name' => $request->name,
            'document' => $request->file('document')->store('uploads', 'public'),
            'current_language' => $request->current_language,
            'process_language' => $request->process_language,
            'status' => $request->status
        ]);

        return response()->json([
            'status' => true,
            'statusCode' => 201,
            'message' => 'Document created successfully',
            'data' => $document
        ], 201);
    }

    /**
     * Display the specified document
     */
    public function show($id)
    {
        $document = Document::find($id);

        if (!$document) {
            return response()->json([
                'status' => false,
                'statusCode' => 404,
                'message' => 'Document not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'statusCode' => 200,
            'message' => 'Document retrieved successfully',
            'data' => $document
        ], 200);
    }

    /**
     * Update the specified document
     */
    public function update(Request $request, $id)
    {
        $document = Document::find($id);

        if (!$document) {
            return response()->json([
                'status' => false,
                'statusCode' => 404,
                'message' => 'Document not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'current_language' => 'required|string',
            'process_language' => 'required|string',
            'status' => 'required|in:Pending,Processing,Completed,Rejected'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'statusCode' => 422,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        if($request->file('document')){
            $document->document =$request->file('document')->store('uploads', 'public');
        }
        $document->name = $request->name;
        $document->current_language = $request->current_language;
        $document->process_language = $request->process_language;
        $document->status = $request->status;
        $document->save();
        return response()->json([
            'status' => true,
            'statusCode' => 200,
            'message' => 'Document updated successfully',
            'data' => $document
        ], 200);
    }

    /**
     * Remove the specified document
     */
    public function destroy($id)
    {
        $document = Document::find($id);

        if (!$document) {
            return response()->json([
                'status' => false,
                'statusCode' => 404,
                'message' => 'Document not found'
            ], 404);
        }

        $document->delete();

        return response()->json([
            'status' => true,
            'statusCode' => 200,
            'message' => 'Document deleted successfully'
        ], 200);
    }
}
