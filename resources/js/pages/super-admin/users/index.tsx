import {useState} from 'react';
import {Head, router} from '@inertiajs/react';
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
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    tenant_id: number | null;
    tenant?: {
        name: string;
    };
}

interface Props {
    users: User[];
}

const roleBadgeStyles: Record<string, string> = {
    super_admin: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/15',
    clinic_admin: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/15',
    doctor: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/15',
    patient: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/15',
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/admin/users',
    },
];

export default function UsersIndex({users = []}: Props) {
    //1. Pagination Configuration State
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    //Direct array safe-guard check
    const safeUsers = Array.isArray(users) ? users : [];

    //2. Math calculations to splice rows based on current page index counters
    const totalItems = safeUsers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    //Slice only the 10 records matching the visibile viewport frame chunk
    const currentPageUsers = safeUsers.slice(indexOfFirstItem, indexOfLastItem);

    const toggleStatus = (id: number) => {
        router.patch(`/admin/users/${id}/toggle`, {}, {
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">User Directory</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="py-4 pl-6">Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Hospital / Clinic </TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Account Access</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentPageUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentPageUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium pl-6">{user.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium text-foreground">
                                                    {user.tenant?.name || <span className="text-muted-foreground italic">System / N/A</span>}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`capitalize font-medium ${roleBadgeStyles[user.role] ?? 'bg-muted text-muted-foreground'}`}
                                                >
                                                    {user.role.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/30'}`}></span>
                                                    <span className={`text-sm ${user.is_active ? 'text-green-600 dark:text-green-400 font-medium' : 'text-muted-foreground'}`}>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end">
                                                    {/* Pure Tailwind INline Switch Component */}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleStatus(user.id)}
                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${user.is_active ? 'bg-primary' : 'bg-input'}`}
                                                    >
                                                        <span
                                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${user.is_active ? 'translate-x-5' : 'translate-x-0'}`}
                                                        />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination Navigation Footer Controls Area */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/10">
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium test-foreground">{indexOfFirstItem + 1}</span> to{" "}
                                    <span className="font-medium test-foreground">{Math.min(indexOfLastItem, totalItems)}</span> of{" "}
                                    <span className="font-medium test-foreground">{totalItems}</span> results
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-1 text-sm font-medium px-2 text-muted-foreground">
                                        Page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}