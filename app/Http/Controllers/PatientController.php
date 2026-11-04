<?php

namespace App\Http\Controllers;

use App;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Appointment;
use App\Models\DoctorAvailability;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function storeAppointment(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required|date_format:H:i',
            'patient_notes' => 'nullable|string',
        ]);

        $tenantId = auth()->user()->tenant_id;
        $patientId = auth()->id();
        $doctorId = $request->doctor_id;

        // Check if the selected date falls within the doctor's weekly availability
        $selectedDate = new \DateTime($request->appointment_date);
        $dayOfWeek = (int) $selectedDate->format('w'); // 0 (for Sunday) through 6 (for Saturday)
        $timeSlot = $request->appointment_time;

        $availableSlots = DoctorAvailability::where('doctor_id', $doctorId)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_available', true)
            ->get();

        $isValidSlot = false;
        foreach ($availableSlots as $slot) {
            if ($timeSlot >= $slot->start_time && $timeSlot <= $slot->end_time) {
                $isValidSlot = true;
                break;
            }
        }

        if (!$isValidSlot) {
            return back()->withErrors([
                'appointment_time' => 'The doctor is not available at this date and time. Please check their schedule.',
            ]);
        }

        //Check if the doctor is already booked at this date and time
        $timeSlotBooked = Appointment::where('doctor_id', $doctorId)
            ->where('appointment_date', $request->appointment_date)
            ->where('appointment_time', $request->appointment_time)
            ->whereIn('status', [Appointment::STATUS_PENDING, Appointment::STATUS_CONFIRMED])
            ->exists();

        if ($timeSlotBooked) {
            return back()->withErrors(['appointment_time' => 'This doctor is already booked for this date and time.']);
        }

        // Check if patient already has an active appointment with this doctor
        $activeAppointment = Appointment::where('patient_id', $patientId)
            ->where('doctor_id', $doctorId)
            ->whereIn('status', [Appointment::STATUS_PENDING, Appointment::STATUS_CONFIRMED])
            ->exists();
        
        if ($activeAppointment) {
            return back()->withErrors(['doctor_id' => 'You already have an active appointment with this doctor.']);
        }

        Appointment::create([
            'tenant_id' => $tenantId,
            'patient_id' => $patientId,

            'doctor_id' => $doctorId,
            'appointment_date' => $request->appointment_date,
            'appointment_time' => $request->appointment_time,
            'patient_notes' => $request->patient_notes,
            'status' => Appointment::STATUS_PENDING,
        ]);

        return back()->with('success', 'Appointment booked successfully.');
    }
}
