import { useRef, MutableRefObject } from "react";
import * as THREE from "three";
import {
  OrbitControls,
  PivotControls,
  TransformControls,
  Html,
  // Text,
  Float,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

function Render() {
  const cubeRef = useRef<THREE.Mesh>(null) as MutableRefObject<THREE.Mesh>;
  const sphereRef = useRef<THREE.Mesh>(null) as MutableRefObject<THREE.Mesh>;

  const controls = useControls({
    position: {
      value: { x: 4, y: 1 },
      step: 0.1,
      joystick: "invertY",
    },
  });
  const { position } = controls;

  return (
    <>
      <Perf position="top-left" />
      <Html>
        <div style={{ whiteSpace: "nowrap", color: "violet" }}>
          HTML을 섞어서 쓸 수 있어요
        </div>
      </Html>
      <OrbitControls enableDamping={false} makeDefault />
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 2, 3]} intensity={4.5} />
      <>
        <PivotControls
          anchor={[1, 1, 1]}
          depthTest={false}
          lineWidth={4}
          axisColors={["#3f1ff7", "#ff4d6d", "#66ff06"]}
          scale={2}
          // fixed
        >
          <Float speed={50}>
            <mesh
              position-x={-5}
              scale={1.5}
              rotation-y={Math.PI * 0.5}
              ref={cubeRef}
            >
              <boxGeometry />
              <meshStandardMaterial color="orange" />

              <Html
                center
                wrapperClass="label"
                distanceFactor={0.03}
                occlude={[cubeRef, sphereRef]}
              >
                <div
                  style={{
                    whiteSpace: "nowrap",
                    color: "blue",
                    backgroundColor: "skyblue",
                  }}
                >
                  cube를 쫓아다니는 HTML
                </div>
              </Html>
            </mesh>
          </Float>
          {/* <Text font="/fonts/bangers-v20-latin-regular.woff">
            cube를 쫓아다니는 HTML
          </Text> */}
        </PivotControls>
        <TransformControls object={cubeRef} mode="rotate" />
      </>
      <>
        <mesh ref={sphereRef} position={[position.x, position.y, 0]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial color="purple" />
        </mesh>
        <TransformControls object={sphereRef} />
      </>
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />

        <MeshReflectorMaterial
          resolution={512}
          blur={[1000, 1000]}
          mixBlur={1}
          mirror={0.5}
          color="greenyellow"
        />
      </mesh>
    </>
  );
}

export default Render;
