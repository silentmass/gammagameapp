'use client'

import ConcentricCircles from '@/app/ui/concentric-circles';
import Nback from "@/app/ui/nback";

export default function Page() {

    return (
        <main className="flex min-h-screen flex-col justify-center items-center p-0">
            <Nback stimulusDuration={null} interStimulusInterval={null} forcedChoice={null}>
                <ConcentricCircles />
            </Nback>
        </main>
    );
}
