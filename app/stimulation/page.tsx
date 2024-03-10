'use client'
import ConcentricCircles from '@/app/ui/concentric-circles';
import CanvasWrapper from '@/app/ui/canvasWrapper';

export default function Page() {
    return (
        <CanvasWrapper>
            <ConcentricCircles />
            <div className='absolute top-1/2 left-1/2 tranform -translate-x-1/2 -translate-y-1/2 border rounded border-sky-500'>
                <p className='text-4xl  monospace'>🍎</p>
            </div>
        </CanvasWrapper>
    );
}