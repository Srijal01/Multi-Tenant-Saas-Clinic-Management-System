<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\DoctorAvailability;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Super Admin
        User::create([
            'name' => 'Super Administrator',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'), // Change this to a secure password
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        // 2. Clinic A City Hispital
        $clinicA = Clinic::create([
            'name' => 'City Hospital',
            'email'=> 'cityhospital@example.com',
            'phone' => '123-456-7890',
            'address' => '123 Main St, Cityville'
        ]);

        User::create([
            'name' => 'Aditya Singh',
            'email' => 'adityasingh@example.com',
            'password' => Hash::make('password'), // Change this to a secure password
            'role' => 'clinic_admin',
            'tenant_id' => $clinicA->id,
            'is_active' => true,
        ]);

        $doctorA = User::create([
            'name' => 'Dr. John Doe',
            'email' => 'johndoe@example.com',
            'password' => Hash::make('password'), // Change this to a secure password
            'role' => 'doctor',
            'speciality' => 'Cardiology',
            'tenant_id' => $clinicA->id,
            'is_active' => true,
        ]);

        $patientA = User::create([
            'name' => 'Jane Smith',
            'email' => 'janesmith@example.com',
            'password' => Hash::make('password'), // Change this to a secure password
            'role' => 'patient',
            'tenant_id' => $clinicA->id,
            'age' => 30,
            'gender' => 'Female',
            'is_active' => true,
        ]);

        //3. Clinic B Green Valley Clinic
        $clinicB = Clinic::create([
            'name' => 'Green Valley Clinic',
            'email'=> 'greenvalley@example.com',
            'phone' => '123-456-7891',
            'address' => '456 Oak Ave, Green Valley'
        ]);

        User::create([
            'name' => 'Alice Johnson',
            'email' => 'alicejohnson@example.com',
            'password' => Hash::make('password'), // Change this to a secure password
            'role' => 'clinic_admin',
            'tenant_id' => $clinicB->id,
            'is_active' => true,
        ]);

        $doctorB = User::create([
            'name' => 'Dr. Emily Brown',
            'email' => 'emilybrown@example.com',
            'password' => Hash::make('password'), // Change this to a secure password
            'role' => 'doctor',
            'speciality' => 'Pediatrics',
            'tenant_id' => $clinicB->id,
            'is_active' => true,
        ]);

        $patientB = User::create([
            'name' => 'Michael Lee',
            'email' => 'michellee@example.com',
            'password' => Hash::make('password'), // Change this to a secure password
            'role' => 'patient',
            'tenant_id' => $clinicB->id,
            'is_active' => true,
        ]);

        //4. Doctor Weekly Availabilities
        $timeSlots = [
            ['start' => '09:00:00', 'end' => '12:00:00'],
            ['start' => '13:00:00', 'end' => '17:00:00']
        ];

        foreach ([$doctorA, $doctorB] as $doctor) {
            for ($day = 1; $day <= 5; $day++) { // Monday to Friday
                foreach ($timeSlots as $slot) {
                    DoctorAvailability::create([
                        'tenant_id' => $doctor->tenant_id,
                        'doctor_id' => $doctor->id,
                        'day_of_week' => $day,
                        'start_time' => $slot['start'],
                        'end_time' => $slot['end'],
                        'is_available' => true,
                    ]);
                }
            }
        }

        //5. Sample Appointments
        $appointmentsData = [
            ['clinic' => $clinicA, 'doctor' => $doctorA, 'patient' => $patientA],
            ['clinic' => $clinicB, 'doctor' => $doctorB, 'patient' => $patientB],
        ];

        foreach ($appointmentsData as $data){
            $date = Carbon::today()->addDays(rand(1, 14)); // Random date within the next 30 days
            $time = Carbon::createFromTime(rand(9, 16), 0)->format('H:i'); // Random time between 9 AM and 4 PM

            Appointment::create([
                'tenant_id' => $data['clinic']->id,
                'doctor_id' => $data['doctor']->id,
                'patient_id' => $data['patient']->id,
                'appointment_date' => $date->format('Y-m-d'),
                'appointment_time' => $time,
                'status' => Appointment::STATUS_CONFIRMED,
                'patient_notes' => 'Regular check-up appointment.',
            ]);

            $pastDate = Carbon::today()->subDays(rand(5, 30)); // Random past date within the last 30 days
            $pastTime = Carbon::createFromTime(rand(9, 16), 0)->format('H:i'); // Random time between 9 AM and 4 PM

            Appointment::create([
                'tenant_id' => $data['clinic']->id,
                'doctor_id' => $data['doctor']->id,
                'patient_id' => $data['patient']->id,
                'appointment_date' => $pastDate->format('Y-m-d'),
                'appointment_time' => $pastTime,
                'status' => Appointment::STATUS_COMPLETED,
                'patient_notes' => 'Follow-up consultation.',
                'doctor_notes' => 'Patient is recovering well. Schedule next visit in 3 months.',
                'completed_at' => $pastDate->addHours(1), // Assuming the appointment lasted 1 hour
            ]);
        }
    }
}
