import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CalendarDays, CheckCircle2, Stethoscope, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    totalDoctors?: number;
    totalPatients?: number;
    pendingDoctors?: number;
}

export default function Dashboard({ totalDoctors = 0, totalPatients = 0, pendingDoctors = 0 }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Doctors</CardTitle>
                            <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{totalDoctors}</p>
                            <p className="text-xs text-muted-foreground">Active doctors in your clinic</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Patients</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{totalPatients}</p>
                            <p className="text-xs text-muted-foreground">Registered clinic patients</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending approvals</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{pendingDoctors}</p>
                            <p className="text-xs text-muted-foreground">Doctors awaiting approval</p>
                        </CardContent>
                    </Card>
                </div>
                <Card className="min-h-[400px] flex-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            Today&apos;s clinic activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
                        No activity to display yet.
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
