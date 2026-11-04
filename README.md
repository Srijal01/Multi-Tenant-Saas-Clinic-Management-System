# CarePoint Clinic

CarePoint Clinic is a multi-tenant clinic management system built with Laravel 12, Inertia.js, React, and TypeScript. It provides role-based access for clinic administrators, doctors, patients, and super administrators.

## Features

- Multi-clinic tenant support
- Role-based dashboards and navigation
- Patient and doctor management
- Appointment management
- Doctor availability and scheduling
- Clinic administration and approval workflows
- Fortify-powered login, registration, password reset, and password updates
- Responsive CarePoint Clinic interface with light and dark themes

## Requirements

- PHP 8.2 or newer
- Composer
- Node.js and npm
- SQLite or MySQL
- A web server such as Laravel's built-in server, XAMPP, or Laravel Sail

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Srijal01/Multi-Tenant-Saas-Clinic-Management-System.git
cd Multi-Tenant-Saas-Clinic-Management-System
composer install
npm install
```

Create the environment file and application key:

```bash
copy .env.example .env
php artisan key:generate
```

Configure the database in `.env`. SQLite can be used for local development:

```env
DB_CONNECTION=sqlite
```

Create the SQLite file if it does not exist:

```bash
type nul > database\database.sqlite
```

For MySQL, use settings similar to:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=multi_tenant
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations:

```bash
php artisan migrate
```

## Running locally

Start Laravel and Vite in separate terminals:

```bash
php artisan serve
npm run dev
```

The application is available at [http://localhost:8000](http://localhost:8000).

Alternatively, use the Composer development command:

```bash
composer run dev
```

## Registration

New users register with:

- Name
- Email address
- Password
- Role: `doctor` or `patient`
- Clinic

Email verification is not required. Clinic administrators and super administrators can manage users and clinic operations after authentication.

## Useful commands

```bash
# Clear Laravel caches
php artisan optimize:clear

# Run the test suite
php artisan test

# Build frontend assets
npm run build

# Check frontend formatting
npm run format:check

# Format frontend files
npm run format
```

## Project structure

```text
app/
  Actions/Fortify/       Fortify user and password actions
  Http/Controllers/      Application controllers
  Models/                Eloquent models
  Providers/             Service providers
resources/
  js/components/         Shared React components
  js/layouts/            Application and authentication layouts
  js/pages/              Inertia pages
  css/                   Global theme and styles
routes/                  Web and authentication routes
tests/                   Feature and unit tests
```

## License

This project is released under the MIT license.
