'use client'

import ConcentricCircles from '@/app/ui/concentric-circles';
import Nback from "@/app/ui/nback";

export default function Page() {

    return (
        <main className="flex min-h-screen flex-col items-center p-0">
            <Nback>
                <ConcentricCircles />
            </Nback>
        </main>
    );
}
