import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, ArrowRight, Calendar, ClipboardList, PlusCircle, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    upcomingAppointments?: number;
    totalVisits?: number;
    pendingAppointments?: number;
}

export default function PatientDashboard({ upcomingAppointments = 0, totalVisits = 0, pendingAppointments = 0 }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                {/* Welcome Header */}
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Your Health Dashboard</h2>
                    <p className="text-muted-foreground text-sm">Manage your appointments and health records.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Upcoming Appointments</CardTitle>
                            <div className="rounded-full border border-blue-500/20 bg-blue-500/10 p-1.5">
                                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{upcomingAppointments}</div>
                            {pendingAppointments > 0 && (
                                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{pendingAppointments} awaiting confirmation</p>
                            )}
                            <Link
                                href="/appointments"
                                className="group mt-1 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:opacity-80 dark:text-blue-400"
                            >
                                Manage bookings <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Appointment History</CardTitle>
                            <div className="bg-muted border-border rounded-full border p-1.5">
                                <ClipboardList className="text-muted-foreground h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalVisits}</div>
                            <p className="text-muted-foreground mt-1 text-xs">Total visits to date</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Active Consultations</CardTitle>
                            <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 p-1.5">
                                <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-muted-foreground mt-1 text-xs">Currently in progress</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                                <CardDescription>Book a new appointment or find a doctor.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center gap-4 py-6">
                            <div className="rounded-full border border-blue-500/20 bg-blue-500/10 p-3">
                                <PlusCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="space-y-1 text-center">
                                <h3 className="text-sm font-semibold">Need medical attention?</h3>
                                <p className="text-muted-foreground mx-auto max-w-sm text-sm">
                                    Schedule your next consultation with one of our specialized doctors in just a few clicks.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link href="/appointments">
                                    <Button className="bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Book New Appointment
                                    </Button>
                                </Link>
                                <Link href="/doctors">
                                    <Button variant="outline">
                                        <User className="mr-2 h-4 w-4" />
                                        Find a Doctor
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
