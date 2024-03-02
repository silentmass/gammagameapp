import { useRef, useEffect } from 'react';

export default function ConcentricCircles() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radiusIncrement = 19;
            const maxRadius = 200;
            let radius = 0;
            const numberOfCircles = 10;
            let animationFrameId: number;
            let radiusStep = -0.2;

            let currentRadius = 0;



            let start: number, previousTimeStamp;
            let done = false;

            function step() {
                if (ctx && canvas) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    for (let i = 0; i < numberOfCircles; i++) {
                        ctx.beginPath();
                        currentRadius = radiusIncrement * (i + 1) + radius;
                        if (currentRadius < 0) {
                            currentRadius = radiusIncrement * numberOfCircles + currentRadius;
                        }
                        ctx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI, false);
                        ctx.strokeStyle = "white";
                        ctx.lineWidth = radiusIncrement / 2;
                        ctx.stroke();
                    }

                    radius += radiusStep;

                    if (radius > -maxRadius) {
                        animationFrameId = window.requestAnimationFrame(step);
                    } else {
                        radius = radius + maxRadius - radiusIncrement / 2;
                        animationFrameId = window.requestAnimationFrame(step);
                    }
                }

            }

            step();

            return () => {
                window.cancelAnimationFrame(animationFrameId);
            };
        }


    }, []);

    return (
        <canvas className='' ref={canvasRef} width="400" height="400" />
    );
}