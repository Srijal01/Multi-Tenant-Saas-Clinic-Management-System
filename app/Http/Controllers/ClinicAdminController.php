<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Appointment;

class ClinicAdminController extends Controller
{
    public function indexDoctors()
    {
        $tenantId = auth()->user()->tenant_id;

        $doctors = User::withoutGlobalScope('tenant')
            ->with('availabilities')
            ->where('role', 'doctor')
            ->where('is_active', true)
            ->when($tenantId, function ($qyery) use ($tenantId) {
                return $qyery->where('tenant_id', $tenantId);
            })
            ->get()
            ->map(function ($doctor) {
                $availabilities = $doctor->availabilities
                    ->where('is_available', true)
                    ->groupBy('day_of_week')
                    ->map(function ($slots, $day) {
                        return [
                            'day' => (int) $day,
                            'slots' => $slots->map(fn($s) => [
                                'start' => substr($s->start_time, 0, 5),
                                'end' => substr($s->end_time, 0, 5)
                            ]),
                        ];
                })->values();

                return [
                    'id' => $doctor->id,
                    'name' => $doctor->name,
                    'email' => $doctor->email,
                    'specialty' => $doctor->specialty,
                    'availabilities' => $availabilities,
                    'has_availabilities' => $availabilities->isNotEmpty(),
                ];
            });

        return Inertia::render('clinic-admin/doctors/index', [
            'doctors' => $doctors,
        ]);
    }

    //Patients

    public function indexPatients()
    {
        $tenantId = auth()->user()->tenant_id;

        return Inertia::render('clinic-admin/patients/index', [
            'patients' => User::withoutGlobalScope('tenant')
                ->where('role', 'patient')
                ->when($tenantId, function ($qyery) use ($tenantId) {
                    return $qyery->where('tenant_id', $tenantId);
                })
                ->get()
        ]);
    }

    //Approvals

    public function indexApprovals()
    {
        $tenantId = auth()->user()->tenant_id;

        return Inertia::render('clinic-admin/approvals', [
            'pendingDoctors' => User::withoutGlobalScope('tenant')
                ->where('role', 'doctor')
                ->where('is_active', false)
                ->when($tenantId, function ($qyery) use ($tenantId) {
                    return $qyery->where('tenant_id', $tenantId);
                })
                ->get()
        ]);
    }

    public function approveDoctor($id)
    {
        $tenantId = auth()->user()->tenant_id;

        $user = User::withoutGlobalScope('tenant')
            ->where('id', $id)
            ->where('role', 'doctor')
            ->when($tenantId, function ($qyery) use ($tenantId) {
                return $qyery->where('tenant_id', $tenantId);
            })
            ->firstOrFail();

        $user->is_active = true;
        $user->save();

        return redirect()->back()->with('success', 'Doctor approved successfully.');
    }
}
