<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Clinic;
use App\Models\DoctorAvailability;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function confirmAppointment($id)
    {
        $doctorId = auth()->id();
        $tenantId = auth()->user()->tenant_id;

        $appointment = Appointment::where('id', $id)
            ->where('doctor_id', $doctorId)
            ->where($tenantId, function ($query) use ($tenantId) {
                return $query->where('tenant_id', $tenantId);
            })
            ->where('status', Appointment::STATUS_PENDING)
            ->first();

        if (!$appointment) {
            return back()->with('error', 'Appointment not found or not in pending status.');
        }

        $appointment->update([
            'status' => Appointment::STATUS_CONFIRMED,
        ]);

        return back()->with('success', 'Appointment confirmed successfully.');
    }

    public function completeAppointment(Request $request, $id)
    {
        try {
            $doctorId = auth()->id();
            $tenantId = auth()->user()->tenant_id;

            if (!$doctorId) {
                return redirect()->route('login')->with('error', 'Please login first.');
            }

            $request->validate([
                'doctor_notes' => 'required|string|min:10',
            ]);

            $appointment = Appointment::where('id', $id)
                ->where('doctor_id', $doctorId)
                ->where($tenantId, function ($query) use ($tenantId) {
                    return $query->where('tenant_id', $tenantId);
                })
                ->where('status', Appointment::STATUS_CONFIRMED)
                ->first();

            if (!$appointment) {
                return back()->with('error', 'Appointment not found or already completed.');
            }

            $appointment->update([
                'status' => Appointment::STATUS_COMPLETED,
                'doctor_notes' => $request->doctor_notes,
                'completed_at' => now(),
            ]);

            return back()->with('success', 'Appointment completed successfully.');
        }catch (\Exception $e) {
            \Log::error('Appointment completion failed.', [
                'message' => $e->getMessage()
            ]);

            return back()->with('error', 'An error occurred while completing the appointment.');
        }
    }

    //Weekly Availability

    public function indexAvailability()
    {
        $doctorId = auth()->id();

        $availabilities = DoctorAvailability::where('doctor_id', $doctorId)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('doctor/availability', [
            'availabilities' => $availabilities,
        ]);
    }

    public function updateAvailability(Request $request)
    {
        $doctorId = auth()->id();

        $validated = $request->validate([
            'slots' => 'required|array',
            'slots.*.day_of_week' => 'required|integer|between:0,6',
            'slots.*.start_time' => 'required|date_format:H:i',
            'slots.*.end_time' => 'required|date_format:H:i|after:slot.*.start_time',
            'slots.*.is_available' => 'boolean',
        ]);

        //Delete all existing slots, then recreate from submitted data
        //This preserves the exact state the doctor configured (including inactive slots)
        DoctorAvailability::where('doctor_id', $doctorId)->delete();

        foreach ($validated['slots'] as $slot) {
            DoctorAvailability::create([
                'doctor_id' => $doctorId,
                'day_of_week' => $slot['day_of_week'],
                'start_time' => $slot['start_time'],
                'end_time' => $slot['end_time'],
                'is_available' => (bool) ($slot['is_available'] ?? true),
            ]);
        }

        return redirect()->route('doctor.availability.index')
            ->with('success', 'Availability updated successfully.');
    }
}
