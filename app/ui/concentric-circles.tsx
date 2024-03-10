import { useRef, useEffect } from 'react';
import { pixelDistanceFromOrigin, opacityInitialPhase } from '@/app/ui/waves';

export default function ConcentricCircles() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const canvasSide = 350;

    const animatedCyclesPerRadius = 10;
    const animatedCyclesPerSecond = 0.5;

    const radiusIncrement = 17;
    let radius = 0;
    const numberOfCircles = 20;
    const maxRadius = radiusIncrement * numberOfCircles;
    let animationFrameId: number;

    useEffect(() => {
        const mainCanvas = canvasRef.current;
        const offscreenCanvas = document.createElement("canvas");

        if (mainCanvas) {
            const centerX = mainCanvas.width / 2;
            const centerY = mainCanvas.height / 2;

            offscreenCanvas.width = mainCanvas.width;
            offscreenCanvas.height = mainCanvas.height;

            const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
            const mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });

            if (offscreenCtx) {
                offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
                offscreenCtx.beginPath();
                offscreenCtx.arc(centerX, centerY, canvasSide / 2, 0, Math.PI * 2);
                offscreenCtx.fillStyle = 'black';
                offscreenCtx.fill();

                const imageData = offscreenCtx.getImageData(0, 0, canvasSide, canvasSide);

                if (mainCtx) {

                }

                const step = () => {
                    if (mainCtx) {
                        let currentTime = Date.now();

                        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

                        mainCtx.drawImage(offscreenCanvas, 0, 0);

                        // Draw mask
                        mainCtx.beginPath();
                        mainCtx.arc(centerX, centerY, 200, 0, Math.PI * 2);
                        mainCtx.clip()


                        // Fill the array with RGBA values
                        for (let i = 0; i < imageData.data.length; i += 4) {
                            if (imageData) {

                                const distanceFromOrigin = pixelDistanceFromOrigin(i, canvasSide, centerX, centerY);
                                if (distanceFromOrigin < canvasSide / 2) {
                                    const colorWeight = (
                                        Math.floor(
                                            255
                                            * (1 + Math.sin(
                                                opacityInitialPhase(currentTime, animatedCyclesPerSecond) + (pixelDistanceFromOrigin(i, canvasSide, centerX, centerY) / (canvasSide / 2) * 2 * Math.PI * animatedCyclesPerRadius)
                                            ))
                                            / 2
                                        )
                                    );
                                    imageData.data[i + 0] = colorWeight < 255 / 2 ? 0 : 255;
                                    imageData.data[i + 1] = colorWeight < 255 / 2 ? 0 : 255;
                                    imageData.data[i + 2] = colorWeight < 255 / 2 ? 0 : 255;
                                    imageData.data[i + 3] = 255;
                                }

                            }
                        }
                        mainCtx.putImageData(imageData, 0, 0);


                        animationFrameId = window.requestAnimationFrame(step)
                    }
                }

                step();

                return () => {
                    window.cancelAnimationFrame(animationFrameId);
                };
            }




        }


    }, []);

    return (
        <canvas className='' ref={canvasRef} width={canvasSide} height={canvasSide} />
    );
}