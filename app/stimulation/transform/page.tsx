'use client'
import Transform from "@/app/ui/transform";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col items-center">
            <div className="flex relative w-full h-full justify-center items-center">
                <Transform />
            </div>
        </div>
    );
}