'use client'
import Transform from "@/app/ui/transform";

export default function Page() {
    return (
        <main className="flex max-w-2xl w-full min-h-screen flex-col justify-center items-center p-0">
            <div className='max-w-2xl h-full w-full flex-col items-center p-0 border border-slate-500 rounded'>
                <Transform />
            </div>
        </main>
    );
}