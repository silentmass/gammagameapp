import { useRef, useEffect } from 'react';

export default function Waves() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const canvasSide = 370;
    const numberOfCircles = 10;
    const radiusIncrement = canvasSide / 2 / numberOfCircles;
    let radius = 0;
    const maxRadius = radiusIncrement * numberOfCircles;
    let animationFrameId: number;
    let radiusStep = -0.2;
    let currentRadius = 0;

    const animatedCyclesPerRadius = 2;
    const animatedCyclesPerSecond = 0.5;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const step = () => {
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Draw mask
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, canvasSide / 2, 0, Math.PI * 2);
                    ctx.clip()

                    // Concentric circles
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

                    const imageData = ctx.getImageData(0, 0, canvasSide, canvasSide);
                    let currentTime = Date.now();
                    let domega = (currentTime / 1000) * 2 * Math.PI * animatedCyclesPerSecond;

                    // Fill the array with RGBA values
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        // Percentage in the x direction
                        let x = (i % (4 * canvasSide) / (4 * canvasSide));
                        // Percentage in the y direction
                        let y = (Math.ceil(i / (4 * canvasSide)) / canvasSide);

                        let ud = x * canvasSide - centerX;
                        let vd = y * canvasSide - centerY;
                        let h = Math.sqrt(Math.pow(ud, 2) + Math.pow(vd, 2));

                        let z = 255 * (1 + Math.sin(domega + (h / (canvasSide / 2) * 2 * Math.PI * animatedCyclesPerRadius))) / 2;
                        if (imageData) {
                            // imageData.data[i + 0] = 255;
                            // imageData.data[i + 1] = 255;
                            // imageData.data[i + 2] = 255;
                            imageData.data[i + 3] = z;

                        }
                    }
                    ctx.putImageData(imageData, 0, 0);

                    animationFrameId = window.requestAnimationFrame(step);

                }
            }

            step();

            return () => {
                window.cancelAnimationFrame(animationFrameId);
            };



        }


    }, []);

    return (
        <canvas className='' ref={canvasRef} width={`${canvasSide}`} height={`${canvasSide}`} />
    );
}