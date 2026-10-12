import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Clinic {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface Props {
    clinics: Clinic[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clinics',
        href: '/admin/clinics',
    },
];

export default function ClinicsIndex({ clinics }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Clinics" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-2xl font-bold">Manage Clinics</CardTitle>
                        <Link href="/admin/clinics/create">
                            <Button className="h-9">
                                <Plus />
                                Add New Clinic
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-1">Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clinics.length == 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground"> No clinics found. </TableCell>
                                    </TableRow>
                                ) : (
                                    clinics.map((clinic) => (
                                        <TableRow key={clinic.id}>
                                            <TableCell className="pl-1 font-medium">{clinic.name}</TableCell>
                                            <TableCell>{clinic.email}</TableCell>
                                            <TableCell>{clinic.phone || 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/admin/clinics/${clinic.id}/edit`}>
                                                    <Button variant="ghost" size="sm">Edit</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}