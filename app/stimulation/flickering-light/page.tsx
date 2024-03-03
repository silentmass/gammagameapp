'use client'
import FlickeringLight from "@/app/ui/flickering-light";


export default function Page() {
    return (
        <div className='flex min-h-screen flex-col items-center'>
            <div className='flex relative w-full h-full justify-center items-center'>
                <FlickeringLight />
            </div>
        </div>
    );
}