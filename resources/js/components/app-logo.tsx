import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <AppLogoIcon className="size-6" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">CarePoint Clinic</span>
                <span className="text-sidebar-primary truncate text-[9px] leading-none font-medium tracking-wide uppercase">Healthcare platform</span>
            </div>
        </>
    );
}
