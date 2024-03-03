'use client'
import Waves from "@/app/ui/waves";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col justify-center items-center">
            <div className="flex relative w-full h-full justify-center items-center">
                <Waves />
            </div>
        </div>
    );
}