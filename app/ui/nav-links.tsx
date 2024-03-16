'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
    { name: 'Shader-test', href: '/shader-test' },
];

export default function NavLinks() {
    const [isVisibleMenu, setIsVisibleMenu] = useState(false);
    const pathname = usePathname();
    const showHideMenu = () => {
        if (isVisibleMenu) {
            return '';
        } else {
            return 'hidden';
        }
    }
    return (
        <>
            <button
                onClick={() => {
                    setIsVisibleMenu(previousValue => !previousValue);
                    console.log('Click', isVisibleMenu);
                }}
                className='flex flex-col size-10 rounded border border-slate-400 bg-slate-500/0 hover:bg-slate-700 active:bg-slate-900 gap-1 justify-center items-center'>
                {[...Array(3)].map((e, i) => (<div key={i} className='w-2/3 h-1 rounded border-0 bg-slate-400'>{ }</div>))}
            </button>
            <div className={`${showHideMenu()} flex flex-col gap-3 bg-slate-900/80 p-2 rounded`}>
                {links.map((link) => {
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`border flex w-full items-center justify-center rounded-md bg-black-50/0 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3`}
                        >
                            <p className="md:block">{link.name}</p>
                        </Link>
                    );
                })}
            </div>

        </>
    );
}
