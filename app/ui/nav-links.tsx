'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
    { name: 'Home', href: '/' },
    {
        name: 'Stimulation',
        href: '/stimulation',
    },
    { name: 'N-Back', href: '/nback' },
    { name: 'N-Back Stimulation', href: '/nback-stimulation' },
    { name: 'Flickering light', href: '/stimulation/flickering-light' },
    { name: 'Transform', href: '/stimulation/transform' },
    { name: 'Waves', href: '/stimulation/waves' },
    { name: 'Sudoku', href: '/sudoku' },
];

export default function NavLinks() {
    const pathname = usePathname();
    return (
        <>
            {links.map((link) => {
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={'border flex grow items-center justify-center gap-2 rounded-md bg-black-50/0 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'}
                    >
                        <p className="md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
