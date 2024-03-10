'use client'
import Sudoku from "@/app/ui/sudoku";

export default function Page() {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center border'>
            <div className='flex relative w-full h-full justify-center items-center gap-y-3'>
                <Sudoku />
            </div>
        </div>
    );
}