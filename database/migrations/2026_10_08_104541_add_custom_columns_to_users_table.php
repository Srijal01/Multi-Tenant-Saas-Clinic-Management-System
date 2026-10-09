<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('tenant_id')
                ->nullable()
                ->after('password')
                ->constrained('clinics')
                ->cascadeOnDelete();

            $table->string('role')
                ->default('clinic_admin')
                ->after('tenant_id');

            $table->string('phone')
                ->nullable()
                ->after('role');

            $table->string('speciality')
                ->nullable()
                ->after('phone');

            $table->integer('age')
                ->nullable()
                ->after('speciality');

            $table->string('gender')
                ->nullable()
                ->after('age');

            $table->boolean('is_active')
                ->default(true)
                ->after('gender');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('tenant_id');
            $table->dropColumn([
                'role',
                'phone', 
                'speciality',
                'age',
                'gender',
                'is_active'
            ]);
        });
    }
};
