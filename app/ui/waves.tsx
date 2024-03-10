import { useRef, useEffect } from 'react';

export const pixelDistanceFromOrigin = (i: number, canvasSideWidth: number, canvasCenterX: number, canvasCenterY: number) => {
    return Math.sqrt(Math.pow(((i % (4 * canvasSideWidth) / (4 * canvasSideWidth)) * canvasSideWidth - canvasCenterX), 2) + Math.pow(((Math.ceil(i / (4 * canvasSideWidth)) / canvasSideWidth) * canvasSideWidth - canvasCenterY), 2));
}

export const opacityInitialPhase = (currentTime: number, animatedCyclesPerSecond: number) => {
    return (currentTime / 1000) * 2 * Math.PI * animatedCyclesPerSecond;
}

export default function Waves() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const canvasSide = 350;
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
                offscreenCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

                // Concentric circles
                for (let i = 0; i < numberOfCircles; i++) {
                    offscreenCtx.beginPath();
                    currentRadius = radiusIncrement * (i + 1) + radius;
                    if (currentRadius < 0) {
                        currentRadius = radiusIncrement * numberOfCircles + currentRadius;
                    }
                    offscreenCtx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI, false);
                    offscreenCtx.strokeStyle = "white";
                    offscreenCtx.lineWidth = radiusIncrement / 2;
                    offscreenCtx.stroke();
                }

                const imageData = offscreenCtx.getImageData(0, 0, canvasSide, canvasSide);


                if (mainCtx) {
                    // Draw mask
                    mainCtx.beginPath();
                    mainCtx.arc(centerX, centerY, canvasSide / 2, 0, Math.PI * 2);
                    mainCtx.clip()
                }



                const step = () => {
                    if (mainCtx) {
                        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

                        mainCtx.drawImage(offscreenCanvas, 0, 0);

                        let currentTime = Date.now();

                        // Fill the array with RGBA values
                        for (let i = 0; i < imageData.data.length; i += 4) {
                            const distanceFromCenter = pixelDistanceFromOrigin(i, canvasSide, centerX, centerY);
                            if (imageData && distanceFromCenter < canvasSide / 2) {
                                // imageData.data[i + 0] = 255;
                                // imageData.data[i + 1] = 255;
                                // imageData.data[i + 2] = 255;
                                imageData.data[i + 3] = (
                                    Math.floor(
                                        255
                                        * (1 + Math.sin(
                                            opacityInitialPhase(currentTime, animatedCyclesPerSecond) + (pixelDistanceFromOrigin(i, canvasSide, centerX, centerY) / (canvasSide / 2) * 2 * Math.PI * animatedCyclesPerRadius)
                                        ))
                                        / 2
                                    )
                                );
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
        <canvas className='' ref={canvasRef} width={`${canvasSide}`} height={`${canvasSide}`} />
    );


}