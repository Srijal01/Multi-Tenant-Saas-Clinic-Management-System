import {Head, useForm} from '@inertiajs/react';
import {useState} from 'react';
import AppLayout from '@/layouts/app-layout';
import {type BreadcrumbItem} from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {CheckCircle, ShieldAlert, Mail, User, Search, ChevronLeft, ChevronRight, Clock, AlertCircle} from 'lucide-react';

interface Doctor {
    id: number;
    name: string;
    email: string;
}

interface Props {
    pendingDoctors: Doctor[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {title: 'Dashboard', href: '/dashboard'},
    {title: 'Approvals', href: '/admin/approvals'},
];

export default function Approvals({pendingDoctors}: Props) {
    const { post, processing } = useForm();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmApprove, setConfirmApprove] = useState<Doctor | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const itemsPerPage = 10;

    const safeDoctors = Array.isArray(pendingDoctors) ? pendingDoctors : [];
    const filteredDoctors = safeDoctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalItems = filteredDoctors.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const openConfirm = (doctor: Doctor) => {
        setConfirmApprove(doctor);
        setIsConfirmOpen(true);
    };

    const approveDoctor = () => {
        if (!confirmApprove) return;

        post(`/admin/approvals/${confirmApprove.id}/approve`, {
            preserveScroll: true,
            onFinish: () => {
                setIsConfirmOpen(false);
                setConfirmApprove(null);
            },
        });
    };

    //Get initials for doctor avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending Approvals" />

            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                {/* Stats Card */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-500/5 via-background to-background shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="rounded-full bg-amber-500/10 p-2.5 ring-1 ring-amber-500/20">
                                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Pending Reviews</p>
                                <p className="text-lg font-bold">{safeDoctors.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-500/5 via-background to-background shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="rounded-full bg-blue-500/10 p-2.5 ring-1 ring-blue-500/20">
                                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Awaiting Since</p>
                                <p className="text-lg font-bold">Registration</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-500/5 via-background to-background shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="rounded-full bg-emerald-500/10 p-2.5 ring-1 ring-emerald-500/20">
                                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Status</p>
                                <p className="text-lg font-bold">{safeDoctors.length === 0 ? 'All Approved' : 'Needs Review'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Card */}
                <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-bold">Pending Approvals</CardTitle>
                                <CardDescription>
                                    Review and authorize new doctor accounts
                                </CardDescription>
                            </div>
                            <div className="rounded-full bg-amber-500/10 p-2 border border-amber-500/20">
                                <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                        {/* Search */}
                        <div className="relative mt-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-9 max-w-sm"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/20">
                                    <TableHead className="font-semibold">Doctor</TableHead>
                                    <TableHead className="font-semibold hidden sm:table-cell">Email</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="text-right font-semibold">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentDoctors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-3 py-4">
                                                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3">
                                                    <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {searchQuery ? 'No doctors match your search.' : 'All caught up!'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {searchQuery
                                                            ? 'Try adjusting your search terms.'
                                                            : 'No pending approvals at the moment.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentDoctors.map((doctor) => (
                                        <TableRow key={doctor.id} className="transition-colors hover:bg-muted/30">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 shrink-0">
                                                        {getInitials(doctor.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{doctor.name}</p>
                                                        <p className="text-sm text-muted-foreground sm:hidden">{doctor.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground hidden sm:table-cell">
                                                <span className="flex items-center gap-1.5 text-sm">
                                                    <Mail className="h-3.5 w-3.5" /> {doctor.email}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 gap-1"
                                                >
                                                    <AlertCircle className="h-3 w-3" />
                                                    Awaiting
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    onClick={() => openConfirm(doctor)}
                                                    disabled={processing}
                                                    className="h-8 gap-1.5"
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    Approve
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t bg-muted/10 px-6 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                                    </Button>
                                    <span className="px-2 text-sm text-muted-foreground">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            {/* Confirm Approval Dialog */}
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="rounded-full bg-emerald-500/10 p-1.5">
                                <ShieldAlert className="h-5 w-5 text-emerald-600" />
                            </div>
                            Confirm Approval
                        </DialogTitle>
                        <DialogDescription>
                            This will activate the doctor's account and allow them to access the system.
                        </DialogDescription>
                    </DialogHeader>
                    {confirmApprove && (
                        <div className="py-2">
                            <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/400 dark:text-amber-300">
                                    {getInitials(confirmApprove.name)}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{confirmApprove.name}</p>
                                    <p className="text-xs text-muted-foreground">{confirmApprove.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsConfirmOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="button" onClick={approveDoctor} disabled={processing}>
                            {processing ? 'Approving...' : 'Approve Doctor'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}