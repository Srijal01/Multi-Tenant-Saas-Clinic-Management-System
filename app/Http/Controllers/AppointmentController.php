<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Clinic;

class AppointmentController extends Controller
{
    public function index()
    {
        $tenantId = auth()->user()->tenant_id;
        $user = auth()->user();

        $appointments = Appointment::with(['patient', 'doctor'])
            ->when($tenantId, function ($query) use ($tenantId) {
                return $query->where('tenant_id', $tenantId);
            })
            ->when($user->role === 'patient', function ($query) use ($user) {
                return $query->where('patient_id', $user->id);
            })
            ->when($user->role === 'doctor', function ($query) use ($user) {
                return $query->where('doctor_id', $user->id);
            })
            ->latest()
            ->get();

            return Inertia::render('appointments/index', [
                'appointments' => $appointments
            ]);
    }

}
