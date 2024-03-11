'use client'
import Sudoku from "@/app/ui/sudoku";
import CanvasWrapper from "@/app/ui/canvasWrapper";

export default function Page() {
    return (
        <CanvasWrapper>
            <Sudoku />
        </CanvasWrapper>
    );
}