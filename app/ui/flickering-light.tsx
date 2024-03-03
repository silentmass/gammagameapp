import { useRef, useEffect } from 'react';

export default function FlickeringLight() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        let animationFrameId: number;
        let previousChangeFrame = 0;
        let lightOn = true;
        const flickerFrequency = 40;
        const flickerInterval = 1 / (flickerFrequency / 60);

        const canvasSide = 200;

        if (canvas) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const ctx = canvas.getContext('2d');

            const step = () => {
                if (ctx && canvas) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    if (animationFrameId > previousChangeFrame + flickerInterval) {
                        previousChangeFrame = animationFrameId;
                        lightOn = !lightOn;
                    }

                    ctx.fillRect(centerX - canvasSide / 2, centerY - canvasSide / 2, canvasSide, canvasSide);
                    ctx.fillStyle = lightOn ? 'white' : 'black';


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