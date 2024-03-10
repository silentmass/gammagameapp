'use client'

import ConcentricCircles from '@/app/ui/concentric-circles';
import Nback from "@/app/ui/nback";
import CanvasWrapper from '@/app/ui/canvasWrapper';

export default function Page() {

    return (
        <CanvasWrapper>
            <Nback stimulusDuration={null} interStimulusInterval={null} forcedChoice={null}>
                <ConcentricCircles />
            </Nback>
        </CanvasWrapper >
    );
}
