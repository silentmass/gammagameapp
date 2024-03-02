import { useRef, useEffect } from 'react';

export default function Transform() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        let animationFrameId: number;
        let previousChangeFrame = 0;
        let expand = true;
        const flickerFrequency = 40;
        const flickerInterval = 1 / (flickerFrequency / 60);
        let transformIncrement = 10;
        let currentTransformIncrement = 0;

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
                        centerX - 50 - currentTransformIncrement,
                        centerY - 50 - currentTransformIncrement,
                        100 + 2 * currentTransformIncrement,
                        100 + 2 * currentTransformIncrement
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

    return (<canvas ref={canvasRef} width="400" height="400" />);
}