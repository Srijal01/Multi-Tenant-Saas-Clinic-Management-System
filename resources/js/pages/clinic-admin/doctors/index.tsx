import {Head, useForm, usePage, router} from '@inertiajs/react';
import {useState, useMemo} from 'react';
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
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {
    Stethoscope,
    Mail,
    GraduationCap,
    Users,
    Calendar,
    Search,
    ChevronLeft,
    ChevronRight,
    Clock,
    CalendarDays,
    AlertCircle,
    Sunrise,
    Sun,
} from 'lucide-react';

interface TimeSlot {
    start: string;
    end: string;
}

interface Availability {
    day: number;
    slots: TimeSlot[];
}

interface Doctor {
    id: number;
    name: string;
    email: string;
    speciality: string;
    availabilities?: Availability[];
    has_availability?: boolean;
}

interface Props {
    doctors: Doctor[];
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Doctors',
        href: '/doctors',
    },
];

function formatTime(time: string) {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function isTimeInSlot(time: string, start: string, end: string): boolean {
    return time >= start && time < end;
}

function getTimeOptions(slot: TimeSlot): string[] {
    const [startH, startM] = slot.start.split(':').map(Number);
    const [endH, endM] = slot.end.split(':').map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    const times: string[] = [];

    for (let minute = startMin; minute < endMin; minute += 30) {
        const hour = Math.floor(minute / 60);
        const minutePart = minute % 60;
        times.push(`${String(hour).padStart(2, '0')}:${String(minutePart).padStart(2, '0')}`);
    }

    return times;
}

function getAvailableTimeSlots(availabilities: Availability[] | undefined, dataStr: string): TimeSlot[] {
    if (!availabilities || availabilities.length === 0) return [];
    const date = new Date(dataStr);
    if (isNaN(date.getTime())) return [];
    const dayOfWeek = date.getDay();    // 0=Sun, 1=Mon, ..., 6=Sat
    const dayAvail = availabilities.find((a) => a.day === dayOfWeek);
    return dayAvail?.slots || [];
}

export default function DoctorsIndex({doctors}: Props) {
    const {auth} = usePage().props as any;
    const userRole = auth?.user?.role;

    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [scheduleDoctor, setScheduleDoctor] = useState<Doctor | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateError, setDateError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const itemsPerPage = 10;

    const {data, setData, errors, reset} = useForm({
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        patient_notes: '',
    });

    //Computed available time slots for the selected doctor and date
    const availableTimeSlots = useMemo(() => {
        if (!selectedDoctor || !data.appointment_date) return [];
        return getAvailableTimeSlots(selectedDoctor.availabilities, data.appointment_date);
    }, [selectedDoctor, data.appointment_date]);

    const safeDoctors = Array.isArray(doctors) ? doctors : [];
    const filteredDoctors = safeDoctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalItems = filteredDoctors.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);

    const openBookingModal = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setData('doctor_id', doctor.id.toString());
        setDateError(null);
        setIsBookingOpen(true);
    };

    const openSchedule = (doctor: Doctor) => {
        setScheduleDoctor(doctor);
        setIsScheduleOpen(true);
    };

    const handleDateChange = (value: string) => {
        setData('appointment_date', value);
        setData('appointment_time', ''); // Reset time when date changes
        setDateError(null);

        if (value && selectedDoctor) {
            const slots = getAvailableTimeSlots(selectedDoctor.availabilities, value);
            if (slots.length === 0) {
                setDateError('The doctor is not available on this day. Please check their schedule.');
            }
        }
    };

    const submitBooking = (e: React.FormEvent) => {
        e.preventDefault();

        //Front-end validation: check date & time against availability
        if (selectedDoctor && data.appointment_date && data.appointment_time) {
            const slots = getAvailableTimeSlots(selectedDoctor.availabilities, data.appointment_date);
            if (slots.length === 0) {
                setDateError('The doctor is not available on this day. Please check their schedule.');
                return;
            }
            const isValidTime = slots.some((slot) =>
                isTimeInSlot(data.appointment_time, slot.start, slot.end)
            );
            if (!isValidTime) {
                setDateError('The selected time is outside the doctor\'s available hours.');
                return;
            }
        }

        setIsSubmitting(true);
        router.visit('/appointments', {
            method: 'post',
            data: {
                doctor_id: data.doctor_id,
                appointment_date: data.appointment_date,
                appointment_time: data.appointment_time,
                patient_notes: data.patient_notes,
            },
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsBookingOpen(false);   
                reset();
                setDateError(null);
            },
            onError: (errs: Record<string, string>) => {
                if (errs.appointment_time) {
                    setDateError(errs.appointment_time);
                } else if (errs.appointment_date) {
                    setDateError(errs.appointment_date);
                } else {
                    const firstError = Object.values(errs)[0];
                    if (firstError) setDateError(firstError);
                }
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1); // Reset to first page on new search
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Doctors Directory" />

            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold">Doctors Directory</CardTitle>
                                <CardDescription>
                                    {userRole ==='patient'
                                        ? 'Find a doctor and book your appointment.'
                                        : 'Manage and view all registered medical professionals.'}
                                </CardDescription>
                            </div>
                            <div className="rounded-full bg-blue-500/10 p-2 border border-blue-500/20">
                                <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="relative mt-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by name, email, or speciality..."
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
                                    <TableHead className="font-semibold">Name</TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3.5 w-3.5" /> Email
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className="h-3.5 w-3.5" /> Speciality
                                        </div>
                                    </TableHead>
                                    {userRole === 'patient' && (
                                        <>
                                            <TableHead className="font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3.5 w-3.5" /> Availability
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-right font-semibold">Actions</TableHead>
                                        </>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentDoctors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={userRole === 'patient' ? 5 :3} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Users className="h-8 w-8 opacity-20" />
                                                <p>{searchQuery ? 'No doctors match your search.' : 'No doctors found.'}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentDoctors.map((doctor) => (
                                        <TableRow key={doctor.id} className="transition-colors hover:bg-muted/30">
                                            <TableCell className="font-medium py-4">{doctor.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{doctor.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10">
                                                    {doctor.speciality || 'General Practice'}
                                                </Badge>
                                            </TableCell>
                                            {userRole === 'patient' && (
                                                <>
                                                    <TableCell>
                                                        {doctor.has_availability ? (
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                                                                    Available
                                                                </Badge>
                                                                <Button 
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openSchedule(doctor)}
                                                                    className="h-7 text-xs gap-1 text-muted-foreground"
                                                                >
                                                                    <CalendarDays className="h-3 w-3" /> Schedule
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Badge variant="outline" className="border-muted-foreground/20 text-muted-foreground">
                                                                Not set
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button 
                                                            size="sm"
                                                            onClick={() => openBookingModal(doctor)}
                                                            disabled={!doctor.has_availability}
                                                            className={doctor.has_availability ? 'bg-primary hover:bg-primary/90' : ''}
                                                            variant={doctor.has_availability ? 'default' : 'outline'}
                                                        >
                                                            <Calendar className="mr-2 h-4 w-4" />
                                                            {doctor.has_availability ? 'Book' : 'Unavailable'}
                                                        </Button>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/10">
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium text-foreground">{indexOfFirstItem + 1}</span> to{' '}
                                    <span className="font-medium text-foreground">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
                                    <span className="font-medium text-foreground">{totalItems}</span> results
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                                    </Button>
                                    <div className="flex items-center gap-1 text-sm font-medium px-2 text-muted-foreground">
                                        Page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Schedule Modal Visual Weekly Calendar */}
            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                <DialogContent className="sm:max-w-[560px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="rounded-full bg-primary/10 p-1.5">
                                <CalendarDays className="h-5 w-5 text-primary" />
                            </div>
                            Dr. {scheduleDoctor?.name}'s Weekly Schedule
                        </DialogTitle>
                        <DialogDescription>
                            Available consultation hours
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-1">
                        {scheduleDoctor?.availabilities && scheduleDoctor.availabilities.length > 0 ? (
                            <div className="space-y-2">
                                {scheduleDoctor.availabilities.map((avail) => {
                                    const isWeekend = avail.day === 0 || avail.day === 6;
                                    return (
                                        <div
                                            key={avail.day}
                                            className={`relative overflow-hidden rounded-xl border transition-all hover:shadow-sm ${isWeekend
                                                ? 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20'
                                                : 'border-border bg-card'
                                            }`}
                                        >
                                            {/* Left accent bar */}
                                            <div
                                                className={`absolute left-0 top-0 bottom-0 w-1 ${isWeekend ? 'bg-amber-400' : 'bg-primary'
                                                }`}
                                            />

                                            <div className="flex items-start gap-3 pl-5 pr-4 py-3">
                                                {/* Day badge */}
                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isWeekend
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                                        : 'bg-primary/10 text-primary'
                                                    }`}
                                                >
                                                    {DAY_SHORT[avail.day]}
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold">{DAY_NAMES[avail.day]}</p>
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {avail.slots.map((slot, i) => {
                                                            const startH = parseInt(slot.start.split(':')[0]);
                                                            const isMorning = startH < 12;
                                                            return (
                                                                <div 
                                                                    key={i}
                                                                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${isMorning
                                                                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                                    }`}
                                                                >
                                                                    {isMorning ? (
                                                                        <Sunrise className="h-3 w-3" />
                                                                    ) : (
                                                                        <Sun className="h-3 w-3" />
                                                                    )}
                                                                    {formatTime(slot.start)}  {formatTime(slot.end)}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Weekly summary badge */}
                                <div className="flex items-center justify-center gap-2 pt-1">
                                    <Badge variant="secondary" className="gap-1.5 text-xs">
                                        <CalendarDays className="h-3 w-3" />
                                        {scheduleDoctor.availabilities.length} active day{scheduleDoctor.availabilities.length !== 1 ? 's' : ''}
                                    </Badge>
                                    <Badge variant="secondary" className="gap-1.5 text-xs">
                                        <Clock className="h-3 w-3" />
                                        {scheduleDoctor.availabilities.reduce((sum, a) => sum + a.slots.length, 0)} slot{scheduleDoctor.availabilities.reduce((sum, a) => sum + a.slots.length, 0) !== 1 ? 's' : ''}
                                    </Badge>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                                <div className="rounded-full bg-muted p-3">
                                    <Clock className="h-6 w-6 text-muted-foreground/50" />
                                </div>
                                <p className="text-sm text-muted-foreground">This doctor has not set any availability yet.</p>
                                <p className="text-sm text-muted-foreground/60">Please check back later.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Booking Modal */}
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="rounded-full bg-primary/10 p-1.5">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            Book Appointment
                        </DialogTitle>
                        <DialogDescription>
                            Schedule a consultation with Dr. {selectedDoctor?.name}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitBooking} className="space-y-5">
                        {/* Availability Quick Overview */}
                        {selectedDoctor?.availabilities && selectedDoctor.availabilities.length > 0 && (
                            <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-background to-background p-3">
                                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    Weekly Availability
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {DAY_SHORT.map((label, i) => {
                                        const isAvailable = selectedDoctor.availabilities?.some((a) => a.day === i);
                                        return (
                                            <div
                                                key={i}
                                                className={`flex-1 min-w-[36px] h-7 rounded-md flex items-center justify-center text-[11px] font-semibold transition-all ${isAvailable
                                                    ? i === 0 || i === 6
                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                                    : 'bg-primary/15 text-primary dark:bg-primary/25'
                                                    : 'bg-muted text-muted-foreground/40'
                                                }`}
                                                title={
                                                    isAvailable
                                                        ? `${label} - Available`
                                                        : `${label} - Not Available`
                                                }
                                            >
                                                {label}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Date Picker */}
                        <div className="space-y-1.5">
                            <label htmlFor="appointment_date" className="text-sm font-medium flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                Select Date
                            </label>
                            <input
                                type="date"
                                id="appointment_date"
                                value={data.appointment_date}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:outline-none"
                                required
                            />
                            {dateError && (
                                <div className="flex items-center gap-1.5 text-xs text-destructive mt-1 bg-destructive/5 rounded-md px-2 py-1.5">
                                    <AlertCircle className="h-3 w-3 shrink-0" />
                                    <span>{dateError}</span>
                                </div>
                            )}
                            {errors.appointment_date && <span className="text-xs text-destructive">{errors.appointment_date}</span>}
                        </div>

                        {/* Time Selection */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                Select Time
                            </label>
                            {availableTimeSlots.length > 0 ? (
                                <div className="space-y-2">
                                    {availableTimeSlots.map((slot, i) => {
                                        const times = getTimeOptions(slot);
                                        return (
                                            <div key={i}>
                                                <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTime(slot.start)} - {formatTime(slot.end)}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {times.map((t) => (
                                                        <button
                                                            key={t}
                                                            type="button"
                                                            onClick={() => setData('appointment_time', t)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                                                                data.appointment_time === t
                                                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                                    : 'bg-background border-input hover:bg-accent hover:text-accent-foreground hover:shadow-sm active:scale-95'
                                                            }`}
                                                        >
                                                            {formatTime(t)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <input type="hidden" name="appointment_time" value={data.appointment_time} />
                                </div>
                            ) : data.appointment_date ? (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5">
                                    <Clock className="h-3.5 w-3.5 shrink-0" />
                                    <span>The doctor is not available on this date. Pick a different day.</span>
                                </div>
                            ) : null}
                            {errors.appointment_time && <span className="text-xs text-destructive">{errors.appointment_time}</span>}
                        </div>
                        
                        {/* Notes */}
                        <div className="space-y-1.5">
                            <label htmlFor="patient_notes" className="text-sm font-medium flex items-center gap-1.5">
                                <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
                                Reason / Notes 
                            </label>
                            <textarea
                                id="patient_notes"
                                value={data.patient_notes}
                                onChange={(e) => setData('patient_notes', e.target.value)}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:outline-none"
                                placeholder="Describe your symptoms or reason for visit..."
                            />
                            {errors.patient_notes && <span className="text-xs text-destructive">{errors.patient_notes}</span>}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsBookingOpen(false);
                                    reset();
                                    setDateError(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !data.appointment_time}
                                className="gap-1.5"
                            >
                                {isSubmitting ? (
                                    <>Booking...</>
                                ) : (
                                    <>
                                        <Calendar className="h-4 w-4" />
                                        Confirm Booking
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}