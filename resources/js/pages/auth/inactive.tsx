import {Head, Link} from "@inertiajs/react";
import {Button} from "@/components/ui/button";
import {Clock} from "lucide-react";

export default function Inactive() {
    return (
        <>
            <Head title="Pending Approval" />
            <div className="flex min-h-screen items-center justify-center bg-background p-6">
                <div className="flex flex-col items-center text-center gap-6 max-w-sm">
                    <div className="bg-yellow-100 p-4 rounded-full">
                        <Clock className="w-12 h-12 text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold">Account Pending Approval</h1>
                    <p className="text-muted-foreground">
                        Your account has been created successfully. However, as a Doctor,
                        your account must be reviewed and approved by the Clinic Administrator 
                        before you can access the dashboard.
                    </p>
                    <p className="text-sm font-medium">Please check back later.</p>
                    <Link href="/logout" method="post" as="button" className="w-full">
                        <Button variant="outline" className="w-full">
                            Logout
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}