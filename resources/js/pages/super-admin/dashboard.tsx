import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Building2, CalendarDays, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    totalClinics?: number;
    totalUsers?: number;
    revenue?: number;
}

export default function Dashboard({ totalClinics, totalUsers, revenue }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Super Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total clinics</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{totalClinics ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Clinics managed on the platform</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{totalUsers ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Active users across all clinics</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Platform revenue</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">${revenue ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Revenue recorded this period</p>
                        </CardContent>
                    </Card>
                </div>
                <Card className="min-h-[400px] flex-1">
                    <CardHeader>
                        <CardTitle>System activity &amp; analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
                        No activity to display yet.
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}