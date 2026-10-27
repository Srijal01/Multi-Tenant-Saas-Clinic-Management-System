import {Head, Link} from '@inertiajs/react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';  
import {Button} from '@/components/ui/button';
import {Users, UserCircle, AlertCircle, CalendarDays} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props{
    totalDoctors?: number;
    totalPatients?: number;
    pendingDoctors?: number;
}

export default function ClinicDashboard({totalDoctors = 0, totalPatients = 0, pendingDoctors = 0}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clinic Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">

                {/*Stats Grid*/}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Doctors</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalDoctors}</div>  
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
                            <UserCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPatients}</div>
                        </CardContent>
                    </Card>

                    {/* Pending Approvals - Using amber only for emphasis, adaptive for dark mode */}
                    <Card className={pendingDoctors > 0 ? 'border-amber-500/50 bg-amber-500/50' : ''}>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
                            <AlertCircle className={`h-4 w-4 ${pendingDoctors > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingDoctors}</div>
                            {pendingDoctors > 0 && (
                                <Link href="/admin/approvals" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium">
                                    Review Pending
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-dashed bg-muted/30">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-foreground/5" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        {/* Icon Container - No longer hardcoded white */}
                        <div className="rounded-full bg-background p-3 shadow-sm border border-border">
                            <CalendarDays className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-sm font-semibold text-foreground">Appointment Overview</h3>
                            <p className="text-sm text-muted-foreground">Analytics and scheduling date will appear here.</p>
                        </div>
                        <Link href="/appoinyments">
                            <Button variant="outline" size="sm">
                                View Full Calendar
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
