'use client'
import ConcentricCircles from '@/app/ui/concentric-circles';

export default function Page() {
    return (
        <div className='flex min-h-screen flex-col items-center p-24'>
            <div><p>Stimulation</p></div>
            <div className='flex relative w-full h-full justify-center items-center'>
                <ConcentricCircles />
                <div className='absolute top-1/2 left-1/2 tranform -translate-x-1/2 -translate-y-1/2 border rounded border-sky-500'>
                    <p className='text-4xl  monospace'>🍎</p>
                </div>
            </div>
        </div>
    );
}