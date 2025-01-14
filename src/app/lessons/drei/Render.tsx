import { useRef, MutableRefObject } from "react";
import * as THREE from "three";
import {
  OrbitControls,
  PivotControls,
  TransformControls,
  Html,
} from "@react-three/drei";

function Render() {
  const cubeRef = useRef<THREE.Mesh>(null) as MutableRefObject<THREE.Mesh>;
  const sphereRef = useRef<THREE.Mesh>(null) as MutableRefObject<THREE.Mesh>;

  return (
    <>
      <Html>
        <div style={{ whiteSpace: "nowrap", color: "violet" }}>
          HTML을 섞어서 쓸 수 있어요
        </div>
      </Html>
      <OrbitControls enableDamping={false} makeDefault />
      <ambientLight intensity={1.5} />
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <>
        <PivotControls
          anchor={[1, 1, 1]}
          depthTest={false}
          lineWidth={4}
          axisColors={["#3f1ff7", "#ff4d6d", "#66ff06"]}
          scale={2}
          // fixed
        >
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
              position={[1, 1, 1]}
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
        </PivotControls>
        <TransformControls object={cubeRef} mode="rotate" />
      </>
      <>
        <mesh ref={sphereRef}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial color="purple" />
        </mesh>
        <TransformControls object={sphereRef} />
      </>
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="blue" />
      </mesh>
    </>
  );
}

export default Render;
