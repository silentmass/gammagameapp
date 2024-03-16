'use client'

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
uniform float uTime;
uniform float uScale;
varying float vDistanceFromOriginXZ; // Declare varying to pass distance to fragment shader
varying vec2 vUv;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Calculate distance from origin in xz-plane
  float distanceFromOriginXZ = sqrt(modelPosition.x * modelPosition.x + modelPosition.z * modelPosition.z);

  modelPosition.y += sin(distanceFromOriginXZ * 10.0 + uTime * 2.0) * 0.05;
  
  // Uncomment the code and hit the refresh button below for a more complex effect 🪄
  modelPosition.y += sin(distanceFromOriginXZ * 10.0 + uTime * 2.0) * 0.05;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_PointSize = uScale * 4.0 * sin(distanceFromOriginXZ  * 10.0 + uTime * 2.0) * 0.5 + 0.5;

  gl_Position = projectedPosition;

  vDistanceFromOriginXZ = distanceFromOriginXZ; // Pass the distance to the fragment shader
}
`;

const fragmentShader = `
uniform float uTime; // Uniform to pass time
varying float vDistanceFromOriginXZ; // Receive the distance from the vertex shader
varying vec2 vUv;

vec3 colorA = vec3(0.008,0.895,0.940);
vec3 colorB = vec3(0.129,0.299,1.000);
// vec3 colorA = vec3(1.000,1.000,1.000);
// vec3 colorB = vec3(0.000,0.000,0.000);

void main() {
  
  // Dynamic color based on distance
  float intensity = clamp(sin(vDistanceFromOriginXZ * 50.0 + uTime * 5.0) * 0.5 + 0.5, 0.0, 1.0); // Example calculation
  float threshold = step(0.5, intensity);
  vec3 color = mix(colorA, colorB, threshold);
//   vec3 color = vec3(threshold,threshold,threshold);

  gl_FragColor = vec4(color,1.0);
}
`;

const CustomGeometryParticles = ({ count, shape }: { count: number, shape: string }) => {

    // This reference gives us direct access to our points
    const points = useRef<THREE.Points>(null!);

    // Generate our positions attributes array
    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);

        if (shape === "box") {
            for (let i = 0; i < count; i++) {
                let x = (Math.random() - 0.5) * 2;
                let y = (Math.random() - 0.5) * 2;
                let z = (Math.random() - 0.5) * 2;

                positions.set([x, y, z], i * 3);
            }
        }

        if (shape === "plane") {
            for (let i = 0; i < count; i++) {
                let x = (Math.random() - 0.5) * 2;
                let y = (Math.random() - 0.5) * 0;
                let z = (Math.random() - 0.5) * 2;

                positions.set([x, y, z], i * 3);
            }
        }

        if (shape === "sphere") {
            const distance = 1;

            for (let i = 0; i < count; i++) {
                const theta = THREE.MathUtils.randFloatSpread(360);
                const phi = THREE.MathUtils.randFloatSpread(360);

                let x = distance * Math.sin(theta) * Math.cos(phi)
                let y = distance * Math.sin(theta) * Math.sin(phi);
                let z = distance * Math.cos(theta);

                positions.set([x, y, z], i * 3);
            }
        }

        return positions;
    }, [count, shape]);

    const uniforms = useMemo(() => ({
        uTime: {
            value: 0.0
        },
        uScale: {
            value: 1.0
        },
        // Add any other attributes here
    }), [])

    useFrame(({ clock }) => {
        if (points.current.material instanceof THREE.ShaderMaterial) {
            points.current.material.uniforms.uTime.value = clock.elapsedTime;
            // points.current.material.uniforms.uScale.value = clock.elapsedTime;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particlesPosition.length / 3}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <shaderMaterial
                depthWrite={false}
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
            />
        </points>
    );
};

export default function Page() {
    return (
        <div className='flex w-screen h-screen items-center justify-center'>
            <Canvas camera={{ position: [1.5, 1.5, 1.5] }}>
                <ambientLight intensity={0.5} />
                {/* Try to change the shape prop to "box" and hit reload! */}
                <CustomGeometryParticles count={4000} shape="plane" />
                <OrbitControls autoRotate />
            </Canvas>
        </div>
    );
};