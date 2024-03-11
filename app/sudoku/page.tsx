'use client'
import Sudoku from "@/app/ui/sudoku";
import CanvasWrapper from "@/app/ui/canvasWrapper";
import Waves from "@/app/ui/waves";

export default function Page() {
    return (
        <CanvasWrapper>
            <Sudoku>
                <Waves />
            </Sudoku>
        </CanvasWrapper>
    );
}