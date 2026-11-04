import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="2.4" />
            <path d="M20 11v18M11 20h18" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M14 14.5h2.5M23.5 14.5H26M14 25.5h2.5M23.5 25.5H26" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}
