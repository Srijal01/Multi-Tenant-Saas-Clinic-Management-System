import { Head, useForm } from '@inertiajs/react';
import { ChevronDown, LoaderCircle, Stethoscope, UserRound } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    [key: string]: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'doctor' | 'patient';
    tenant_id: string;
}

interface Clinic {
    id: number;
    name: string;
}

interface RegisterProps {
    clinics?: Clinic[];
}

export default function Register({ clinics = [] }: RegisterProps) {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'doctor',
        tenant_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="role">I am a</Label>
                        <div className="relative">
                            {data.role === 'doctor' ? (
                                <Stethoscope className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            ) : (
                                <UserRound className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            )}
                            <select
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value as RegisterForm['role'])}
                                disabled={processing}
                                className="border-input bg-background ring-offset-background focus:ring-ring h-10 w-full appearance-none rounded-md border px-9 py-2 text-sm focus:ring-2 focus:outline-hidden"
                            >
                                <option value="doctor">Doctor</option>
                                <option value="patient">Patient</option>
                            </select>
                            <ChevronDown className="text-muted-foreground pointer-events-none absolute top-3 right-3 h-4 w-4" />
                        </div>
                        <InputError message={errors.role} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tenant_id">Select Clinic</Label>
                        <div className="relative">
                            <select
                                id="tenant_id"
                                value={data.tenant_id}
                                onChange={(e) => setData('tenant_id', e.target.value)}
                                disabled={processing}
                                required
                                className="border-input bg-background ring-offset-background focus:ring-ring h-10 w-full appearance-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-hidden"
                            >
                                <option value="" disabled>
                                    Select a clinic...
                                </option>
                                {clinics.map((clinic) => (
                                    <option key={clinic.id} value={clinic.id}>
                                        {clinic.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="text-muted-foreground pointer-events-none absolute top-3 right-3 h-4 w-4" />
                        </div>
                        <InputError message={errors.tenant_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
