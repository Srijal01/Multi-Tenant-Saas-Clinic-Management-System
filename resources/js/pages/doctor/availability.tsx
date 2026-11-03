import {Head, router} from "@inertiajs/react";
import {useState, useMemo, useCallback} from "react";
import AppLayout from "@/layouts/app-layout";
import {type BreadcrumbItem} from "@/types";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {
    Clock,
    Plus,
    Trash2,
    Save,
    CalendarDays,
    Sun,
    Sunrise,
    Sunset,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "My Schedule",
        href: "/doctor/availability",
    },
];

// Types

interface Slot {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
}

interface Availability {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
}

interface Props {
    availability: Availability[];
}

// Constants

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_COLORS: Record<number, string> = {
    0:'from-red-500/20 to-orange-500/10',
    1:'from-blue-500/20 to-cyan-500/10',
    2:'from-emerald-500/20 to-green-500/10',
    3:'from-violet-500/20 to-purple-500/10',
    4:'from-amber-500/20 to-yellow-500/10',
    5:'from-rose-500/20 to-pink-500/10',
    6:'from-red-500/20 to-orange-500/10',
};

const DAY_ACCENTS: Record<number, string> = {
    0:'border-red-300 dark:border-red-700',
    1:'border-blue-300 dark:border-blue-700',
    2:'border-emerald-300 dark:border-emerald-700',
    3:'border-violet-300 dark:border-violet-700',
    4:'border-amber-300 dark:border-amber-700',
    5:'border-rose-300 dark:border-rose-700',
    6:'border-red-300 dark:border-red-700',
};

type Present = 'morning' | 'afternoon' | 'fullday';

const PRESETS: {key: Present, label: string, icon: typeof Sun; start: string, end: string}[] = [
    {key: 'morning', label: 'Morning', icon: Sunrise, start: '09:00', end: '12:00'},
    {key: 'afternoon', label: 'Afternoon', icon: Sun, start: '13:00', end: '17:00'},
    {key: 'fullday', label: 'Full Day', icon: Sunset, start: '09:00', end: '17:00'},
];

// Helpers

function formatHour(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

function diffMinutes(start: string, end: string): number {
    return toMinutes(end) - toMinutes(start);
}

// Component

export default function DoctorAvailability({availability}: Props) {
    const existingSlots: Slot[] = Array.isArray(availability)
        ? availability.map((a) => ({
            day_of_week: a.day_of_week,
            start_time: a.start_time.substring(0, 5),
            end_time: a.end_time.substring(0, 5),
            is_available: a.is_available,
        }))
        : [];

    const defaultSlots: Slot[] =
        existingSlots.length > 0
            ? existingSlots
            : (() => {
                const defaults: Slot[] = [];
                for (let d = 1; d <= 5; d++) {
                    defaults.push({day_of_week: d, start_time: '09:00', end_time: '12:00', is_available: true});
                    defaults.push({day_of_week: d, start_time: '13:00', end_time: '17:00', is_available: true});
                }
                return defaults;
            })();

    const [slots, setSlots] = useState<Slot[]>(defaultSlots);
    const [saving, setSaving] = useState(false);
    const [expandedDay, setExpandedDay] = useState<number | null>(null);

    // Derived State

    const stats = useMemo(() => {
        const activeSlots = slots.filter((s) => s.is_available);
        const activeDays = new Set(activeSlots.map((s) => s.day_of_week));
        const totalMinutes = activeSlots.reduce((sum, s) => sum + diffMinutes(s.start_time, s.end_time), 0);
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place
        return { activeSlotsCount: activeSlots.length, activeDaysCount: activeDays.size, totalHours };
    }, [slots]);

    const isDayActive = useCallback(
        (day: number) => slots.some((s) => s.day_of_week === day && s.is_available),
        [slots],
    );

    // Actions

    const addSlot = useCallback(
        (day: number, present?: Present) => {
            if (present) {
                const p = PRESETS.find((pr) => pr.key === present)!;
                const exists = slots.some(
                    (s) => s.day_of_week === day && s.start_time === p.start && s.end_time === p.end,
                );
                if (exists) return;
                setSlots((prev) => [
                    ...prev,
                    {day_of_week: day, start_time: p.start, end_time: p.end, is_available: true},
                ]);
            } else {
                const daySlots = slots.filter((s) => s.day_of_week === day);
                let startHour =
                    daySlots.length > 0 ? parseInt(daySlots[daySlots.length - 1].end_time.split(':')[0]) : 9;
                setSlots((prev) => [
                    ...prev,
                    {
                        day_of_week: day,
                        start_time: `${String(startHour).padStart(2, '0')}:00`,
                        end_time: `${String(startHour + 1).padStart(2, '0')}:00`,
                        is_available: true,
                    },
                ]);
            }
        },
        [slots],
    );

    const removeSlot = useCallback((index: number) => {
        setSlots((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const updateSlot = useCallback((index: number, field: keyof Slot, value: string | boolean | number) => {
        setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, [field]: value} : slot)));
    }, []);

    const toggleDayActive = useCallback(
        (day: number) => {
            const currentlyActive = isDayActive(day);
            setSlots((prev) => {
                const mapped = prev.map((s) => (s.day_of_week === day ? { ...s, is_available: !currentlyActive } : s));
                if (!currentlyActive && !prev.some((s) => s.day_of_week === day)) {
                    mapped.push(
                        { day_of_week: day, start_time: '09:00', end_time: '12:00', is_available: true },
                        { day_of_week: day, start_time: '13:00', end_time: '17:00', is_available: true },
                    );
                }
                return mapped;
            });
        },
        [isDayActive],
    );

    const handleSave = useCallback(() => {
        setSaving(true);
        router.post('/doctor/availability', {slots: slots as any}, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    }, [slots]);

    const toggleExpand = (day: number) => {
        setExpandedDay((prev) => (prev === day ? null : day));
    };

    // Render

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Schedule" />

            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-2.5 shadow-sm ring-1 ring-primary/10">
                            <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Weekly Schedule</h1>
                            <p className="text-sm text-muted-foreground">Set your available consultation houirs.</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="gap-2 shadow-sm">
                        <Save className="h-4 w-4" />
                        {saving ? "Saving..." : 'Save Schedule'}
                    </Button>
                </div>

                {/* Stats Summary */}
                <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-background to-background shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                            <div className="flex items-center gap-3 rounded-lg bg-background/80 p-3 ring-1 ring-border/50">
                                <div className="rounded-full bg-blue-500/10 p-2 ring-1 ring-blue-500/20">
                                    <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Active Days</p>
                                    <p className="text-lg font-bold">
                                        {stats.activeDaysCount}
                                        <span className="text-sm font-normal text-muted-foreground"> / 7</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg bg-background/80 p-3 ring-1 ring-border/50">
                                <div className="rounded-full bg-emerald-500/10 p-2 ring-1 ring-emerald-500/20">
                                    <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Weekly Hours</p>
                                    <p className="text-lg font-bold">
                                        {stats.totalHours}
                                        <span className="text-sm font-normal text-muted-foreground"> hrs</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg bg-background/80 p-3 ring-1 ring-border/50">
                                <div className="rounded-full bg-amber-500/10 p-2 ring-1 ring-amber-500/20">
                                    <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Total Slots</p>
                                    <p className="text-lg font-bold">
                                        {stats.activeSlotsCount}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            {' '}active
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Overview Bar */}
                        <div className="mt-4 flex items-center gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground mr-1 shrink-0">Week</span>
                            {DAY_SHORT.map((label, i) => {
                                const active = isDayActive(i);
                                const isWeekend = i === 0 || i === 6;
                                const daySlots = slots.filter((s) => s.day_of_week === i && s.is_available);
                                const totalMinutes = daySlots.reduce((sum, s) => sum + diffMinutes(s.start_time, s.end_time), 0);
                                const hours = Math.round((totalMinutes / 60) * 10) / 10;
                                return (
                                    <div
                                        key={i}
                                        className={`flex-1 h-8 rounded-md flex items-center justify-center text-[11px] font-semibold transition-all duration-300 ${
                                            active
                                                ? isWeekend
                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                                    : 'bg-primary/15 text-primary dark:bg-primary/25'
                                                : 'bg-muted text-muted-foreground/50'
                                        }`}
                                        title={`${DAY_NAMES[i]}: ${active ? hours + 'h active' : 'Inactive'}`}
                                    >
                                        {label}
                                    </div>
                                );
                            })}
                        </div>

                        {stats.activeSlotsCount === 0 && (
                            <div className="mt-3 flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                <XCircle className="h-4 w-4 shrink-0" />
                                <span>No active slots patients cannot book appointments.</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Day Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {DAY_NAMES.map((dayName, dayIndex) => {
                        const isActive = isDayActive(dayIndex);
                        const isWeekend = dayIndex === 0 || dayIndex === 6;
                        const daySlots = slots.filter((s) => s.day_of_week === dayIndex);
                        const activeDaySlots = daySlots.filter((s) => s.is_available);
                        const activeMinutes = activeDaySlots.reduce((sum, s) => sum + diffMinutes(s.start_time, s.end_time), 0);
                        const activeHours = Math.round((activeMinutes / 60) * 10) / 10;
                        const isExpanded = expandedDay === dayIndex;

                        return (
                            <Card
                                key={dayIndex}
                                className={`group relative overflow-hidden border transition-all duration-300 ${
                                    DAY_ACCENTS[dayIndex]
                                } ${
                                    isActive
                                        ? 'shadow-sm hover:shadow-md'
                                        : 'opacity-60 hover:opacity-80'
                                }`}
                            >
                                {/* Gradient header accent */}
                                <div
                                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                                        DAY_COLORS[dayIndex]
                                    } ${isActive ? '' : 'opacity-30'}`}
                                />  

                                {/* Day Header */}
                                <div
                                    className={`flex items-center justify-between px-4 pt-4 pb-3 cursor-pointer ${
                                        isActive ? '' : 'opacity-70'
                                    }`}
                                    onClick={() => toggleExpand(dayIndex)}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                                                isWeekend
                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                                    : isActive
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {DAY_SHORT[dayIndex]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold leading-tight">{dayName}</p>
                                            {isActive && (
                                                <p className="text-[11px] text-muted-foreground">
                                                    {activeHours > 0 ? `${activeHours}h` : 'No hours'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Day toogle */}
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDayActive(dayIndex);
                                            }}
                                            role="switch"
                                            aria-checked={isActive}
                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-primary shadow-sm'
                                                    : 'bg-input hover:bg-muted-foreground/30'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow-md transition-all duration-200 ${
                                                    isActive ? 'translate-x-4' : 'translate-x-0'
                                                }`}
                                            />
                                        </div>

                                        {/* Expand/Collapse */}
                                        <div className="text-muted-foreground/50">
                                            {isExpanded ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Presets (quick add) */}
                                {isActive && isExpanded && (
                                    <div className="px-4 pb-2">
                                        <div className="flex flex-wrap gap-1.5">
                                            {PRESETS.map((preset) => {
                                                const hasPreset = daySlots.some(
                                                    (s) => s.start_time === preset.start && s.end_time === preset.end,
                                                );
                                                const PresetIcon = preset.icon;
                                                return (
                                                    <Button
                                                        key={preset.key}
                                                        type="button"
                                                        disabled={hasPreset}
                                                        onClick={() => addSlot(dayIndex, preset.key)}
                                                        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all ${
                                                            hasPreset
                                                                ? 'bg-primary/10 text-primary/50 cursor-not-allowed'
                                                                : 'bg-primary/5 text-primary hover:bg-primary/10 hover:shadow-sm active:scale-95'
                                                        }`}
                                                    >
                                                        <PresetIcon className="h-3 w-3" />
                                                        {preset.label}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Slots List */}
                                <div
                                    className={`transition-all duration-300 overflow-hidden ${
                                        isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <Separator />
                                    <div className="divide-y divide-border/50">
                                        {/* Map over full slots array and filter by day to preserve correct indices */}
                                        {slots.filter((s) => s.day_of_week === dayIndex).length === 0 ? (
                                            <div className="px-4 py-6 text-center">
                                                <Clock className="mx-auto h-5 w-5 text-muted-foreground/40 mb-1" />
                                                <p className="text-xs text-muted-foreground/60">
                                                    {isActive ? 'No slots click a preset above' : 'Day is disabled'}
                                                </p>
                                            </div>
                                        ) : (
                                            slots.map((slot, globalIdx) =>
                                                slot.day_of_week === dayIndex ? (
                                                    <div
                                                        key={globalIdx}
                                                        className={`flex flex-wrap items-center gap-3 px-4 py-3 transition-all ${
                                                            slot.is_available ? '' : 'opacity-40'
                                                        } hover:bg-muted/30`} 
                                                    >   
                                                        {/* Slot toggle */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateSlot(globalIdx, 'is_available', !slot.is_available)
                                                            }
                                                            role="switch"
                                                            aria-checked={slot.is_available}
                                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                                                                slot.is_available ? 'bg-primary' : 'bg-input'
                                                            }`}
                                                        >
                                                            <span
                                                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow transition ${
                                                                    slot.is_available ? 'translate-x-4' : 'translate-x-0'
                                                                }`}
                                                            />
                                                        </button>
                                                        
                                                        {/* Time Inputs */}
                                                        <Input
                                                            type="time"
                                                            value={slot.start_time}
                                                            onChange={(e) =>
                                                                updateSlot(globalIdx, 'start_time', e.target.value)
                                                            }
                                                            className="h-9 w-[115px] text-sm"
                                                        />
                                                        <span className="text-sm text-muted-foreground/60 font-medium">to</span>
                                                        <Input
                                                            type="time"
                                                            value={slot.end_time}
                                                            onChange={(e) =>
                                                                updateSlot(globalIdx, 'end_time', e.target.value)
                                                            }
                                                            className="h-9 w-[115px] text-sm"
                                                        />

                                                        {/* Duration badge */}
                                                        <Badge
                                                            variant="outline"
                                                            className="hidden sm:inline-flex text-[11px] px-2 py-0.5 h-6 text-muted-foreground/70"
                                                        >
                                                            {diffMinutes(slot.start_time, slot.end_time)} m
                                                        </Badge>

                                                        {/* Delete */}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => removeSlot(globalIdx)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : null,
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Add Slot Button */}
                                {isActive && isExpanded && (
                                    <div className="border-t border-border/50 px-4 py-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => addSlot(dayIndex)}
                                            className="gap-1 text-xs text-muted-foreground hover:text-foreground h-7 w-full"
                                        >
                                            <Plus className="h-3 w-3" /> Add custom slot
                                        </Button>
                                    </div>
                                )}

                                {/* Collapsed summary when not expanded */}
                                {!isExpanded && isActive && daySlots.length > 0 && (
                                    <div className="border-t border-border/50 px-4 py-2">
                                        <div className="flex flex-wrap gap-1">
                                            {activeDaySlots.slice(0, 3).map((s, i) => (
                                                <Badge
                                                    key={i}
                                                    variant="secondary"
                                                    className="text-[10px] px-1.5 py-0 h-5 font-normal"
                                                >
                                                    {formatHour(s.start_time)} - {formatHour(s.end_time)}
                                                </Badge>
                                            ))}
                                            {activeDaySlots.length > 3 && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] px-1.5 py-0 h-5"
                                                >
                                                    +{activeDaySlots.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Footer Save Bar */}
                <div className="sticky bottom-4 z-10 rounded-xl border bg-background/80 p-4 shadow-lg backdrop-blue-md">
                    <div className="flex item-center justify-between gap-4">
                        <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4 text-primary/60" />
                                <strong className="text-foreground">{stats.activeDaysCount}</strong> day
                                {stats.activeDaysCount !== 1 ? 's' : ''}
                            </span>
                            <span className="text-muted-foreground/30">|</span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-emerald-500/60" />
                                <strong className="text-foreground">{stats.totalHours}</strong> hrs/week
                            </span>
                            <span className="text-muted-foreground/30">|</span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-amber-500/60" />
                                <strong className="text-foreground">{stats.activeSlotsCount}</strong> slot
                                {stats.activeSlotsCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            size="sm"
                            className="gap-2 shadow-sm w-full sm:w-auto"
                        >
                            <Save className="h-4 w-4" />
                            {saving ? "Saving..." : 'Save Schedule'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}