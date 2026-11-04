import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, CalendarCheck, HeartPulse, ShieldCheck, Stethoscope } from 'lucide-react';

import { type SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="CarePoint Clinic" />
            <div className="bg-background text-foreground min-h-screen">
                <header className="border-border/70 border-b">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
                        <Link href={route('home')} className="flex items-center gap-3">
                            <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                                <HeartPulse className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-bold tracking-tight">CarePoint Clinic</div>
                                <div className="text-primary text-[9px] font-medium tracking-wide uppercase">Healthcare platform</div>
                            </div>
                        </Link>
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium text-white"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg px-4 py-2 text-sm font-medium"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium text-white"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main>
                    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
                        <div>
                            <p className="text-primary mb-5 text-sm font-semibold tracking-wide uppercase">For clinics and care teams</p>
                            <h1 className="max-w-2xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
                                Keep your clinic running smoothly.
                            </h1>
                            <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">
                                CarePoint helps your team manage appointments, doctors, patients, and daily work from one straightforward place.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white"
                                >
                                    {auth.user ? 'Open dashboard' : 'Create an account'}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <span className="text-muted-foreground text-sm">No complicated setup</span>
                            </div>
                        </div>

                        <div className="border-border bg-muted/30 rounded-2xl border p-5">
                            <div className="bg-card rounded-xl border p-6 shadow-sm">
                                <div className="flex items-start justify-between border-b pb-5">
                                    <div>
                                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Today</p>
                                        <h2 className="mt-2 text-xl font-semibold">Clinic overview</h2>
                                    </div>
                                    <CalendarCheck className="text-primary h-6 w-6" />
                                </div>
                                <div className="grid gap-3 py-5 sm:grid-cols-2">
                                    <div className="rounded-lg border p-4">
                                        <p className="text-muted-foreground text-sm">Appointments</p>
                                        <p className="mt-2 text-2xl font-semibold">24</p>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <p className="text-muted-foreground text-sm">Care team</p>
                                        <p className="mt-2 text-2xl font-semibold">18</p>
                                    </div>
                                </div>
                                <div className="bg-muted flex items-center gap-3 rounded-lg p-4">
                                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                    <p className="text-muted-foreground text-sm">Your clinic information stays organized and accessible.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="border-border bg-muted/30 border-t">
                        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-3 lg:px-8">
                            <div>
                                <Stethoscope className="text-primary h-5 w-5" />
                                <h3 className="mt-4 font-semibold">For your whole team</h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-6">
                                    Give staff and clinicians the information they need without extra noise.
                                </p>
                            </div>
                            <div>
                                <CalendarCheck className="text-primary h-5 w-5" />
                                <h3 className="mt-4 font-semibold">Simple scheduling</h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-6">
                                    See availability and appointments clearly, at a glance.
                                </p>
                            </div>
                            <div>
                                <ShieldCheck className="text-primary h-5 w-5" />
                                <h3 className="mt-4 font-semibold">Built for trust</h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-6">
                                    Keep day-to-day patient and clinic work in one dependable system.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
