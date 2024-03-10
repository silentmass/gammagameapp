'use client'
import FlickeringLight from "@/app/ui/flickering-light";
import CanvasWrapper from "@/app/ui/canvasWrapper";


export default function Page() {
    return (
        <CanvasWrapper>
            <FlickeringLight />
        </CanvasWrapper>
    );
}