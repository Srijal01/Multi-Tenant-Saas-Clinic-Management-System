import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="bg-muted/30 flex min-h-svh items-center justify-center p-6 md:p-10">
            <div className="relative w-full max-w-md">
                <div className="border-border bg-card flex flex-col gap-8 rounded-xl border p-8 shadow-sm md:p-10">
                    <div className="flex flex-col items-center gap-5">
                        <Link href={route('home')} className="group flex flex-col items-center gap-2 font-medium">
                            <div className="bg-primary group-hover:bg-primary/90 mb-1 flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                                <AppLogoIcon className="text-primary-foreground size-9" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
