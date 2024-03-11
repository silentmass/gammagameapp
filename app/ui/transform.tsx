import { useRef, useEffect } from 'react';

export default function Transform() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const canvasSide = 375;

    useEffect(() => {
        const canvas = canvasRef.current;

        let animationFrameId: number;
        let previousChangeFrame = 0;
        let expand = true;
        const flickerFrequency = 40;
        const flickerInterval = 1 / (flickerFrequency / 60);
        let transformIncrement = 1;
        let currentTransformIncrement = 0;
        const whiteRectWidth = 150;
        const blackRectWidth = 80;

        if (canvas) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const ctx = canvas.getContext('2d');

            const step = () => {
                if (ctx && canvas) {
                    if (!expand) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }


                    if (animationFrameId > previousChangeFrame + flickerInterval) {
                        previousChangeFrame = animationFrameId;
                        expand = !expand;
                        transformIncrement = -transformIncrement;
                    }

                    currentTransformIncrement = (animationFrameId - previousChangeFrame) * transformIncrement;

                    ctx.fillStyle = 'white';

                    ctx.fillRect(
                        centerX - whiteRectWidth - currentTransformIncrement,
                        centerY - whiteRectWidth - currentTransformIncrement,
                        2 * whiteRectWidth + 2 * currentTransformIncrement,
                        2 * whiteRectWidth + 2 * currentTransformIncrement
                    );

                    ctx.clearRect(
                        centerX - blackRectWidth - currentTransformIncrement,
                        centerY - blackRectWidth - currentTransformIncrement,
                        2 * blackRectWidth + 2 * currentTransformIncrement,
                        2 * blackRectWidth + 2 * currentTransformIncrement
                    );



                    animationFrameId = window.requestAnimationFrame(step);
                };
            };

            step();

            return () => {
                window.cancelAnimationFrame(animationFrameId);
            };
        };

    }, []);

    return (<canvas ref={canvasRef} width={canvasSide} height={canvasSide} />);
}