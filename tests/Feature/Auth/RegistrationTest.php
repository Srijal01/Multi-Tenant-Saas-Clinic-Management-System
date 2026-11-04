<?php

use App\Models\Clinic;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $clinic = Clinic::create([
        'name' => 'Test Clinic',
        'email' => 'clinic@example.com',
        'phone' => '555-0100',
        'address' => 'Test Address',
    ]);

    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'patient',
        'tenant_id' => $clinic->id,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});
