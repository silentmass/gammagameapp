'use client'
import Waves from "@/app/ui/waves";
export default function Page() {
    return (
        <div className="relative">
            <div className="bg-slate-500"><Waves /></div>
            <div className="absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-rose-500/0">
                <div className="flex border-0 justify-center p-3">
                    <div className="grid grid-cols-4 gap-3">
                        {[...Array(16)].map((e, i) =>
                            <div key={i} className="flex size-12 border rounded justify-center items-center">{i}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}