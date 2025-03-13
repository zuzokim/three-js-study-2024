import { useRef, MutableRefObject, use, Suspense } from "react";
import * as THREE from "three";
import {
  OrbitControls,
  PivotControls,
  TransformControls,
  Html,
  // Text,
  Float,
  MeshReflectorMaterial,
  useHelper,
  BakeShadows,
  SoftShadows,
  AccumulativeShadows,
  RandomizedLight,
  ContactShadows,
  Sky,
} from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { useFrame } from "@react-three/fiber";
import { INFINITY } from "three/tsl";
import { Fallback, Model } from "./Model";
import { Fox } from "./Fox";

function Render() {
  const directionalLight = useRef<any>();

  useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

  const { color, opacity, blur } = useControls("contact shadows", {
    color: "#1d278f",
    opacity: { value: 0.4, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 },
  });

  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  return (
    <>
      <Perf position="bottom-left" />
      <Sky sunPosition={sunPosition} />
      <ContactShadows
        position={[0, -0.99, 0]}
        scale={10}
        resolution={512}
        far={5}
        color={color}
        opacity={opacity}
        blur={blur}
        frames={1} //bakeshadows와 같이 처음 한번만 렌더링
      />

      <OrbitControls enableDamping={false} makeDefault />
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[-4, 2, 3]}
        intensity={4.5}
        ref={directionalLight}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
      />
      <Suspense fallback={<Fallback />}>
        <Model />
        <Fox />
      </Suspense>
      <mesh
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
        receiveShadow
      >
        <planeGeometry />
        <meshStandardMaterial color="#80fb47" />
      </mesh>
    </>
  );
}

export default Render;
