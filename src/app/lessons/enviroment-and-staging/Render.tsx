import { useRef, MutableRefObject, use } from "react";
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

function Render() {
  const cubeRef = useRef<THREE.Mesh>(null) as MutableRefObject<THREE.Mesh>;
  const sphereRef = useRef<THREE.Mesh>(null) as MutableRefObject<THREE.Mesh>;
  const directionalLight = useRef<any>();

  useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

  useFrame((state, delta) => {
    // const time = state.clock.elapsedTime
    // cube.current.position.x = 2 + Math.sin(time)
    cubeRef.current.rotation.y += delta * 0.2;
  });

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
      <Sky sunPosition={sunPosition}/>
      {/* <BakeShadows /> */}
      {/* 렌더할때마다 shader 업데이트하므로 동적인 값을 사용할 때는 성능 이슈 유의 */}
      {/* <SoftShadows size={25} samples={10} focus={0} /> */}
      {/* plane 보다 살짝 위로 -0.99 */}
      {/* <AccumulativeShadows
        position={[0, -0.99, 0]}
        scale={10}
        color="#316d39"
        opacity={0.8}
        frames={Infinity}
        temporal
        blend={100}
      >
        <RandomizedLight
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={1}
          position={[1, 2, 3]}
          bias={0.001}
        />
      </AccumulativeShadows> */}
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
        // castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        // shadow-camera-far={10}
        // shadow-camera-top={2}
        // shadow-camera-right={2}
        // shadow-camera-bottom={-2}
        // shadow-camera-left={-2}
      />
      <>
        <mesh
          castShadow
          position={[1, 0, 1]}
          scale={1.5}
          rotation-y={Math.PI * 0.5}
          ref={cubeRef}
        >
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </>
      <>
        <mesh ref={sphereRef} position={[4, 1, 0]} castShadow>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial color="purple" />
        </mesh>
      </>
      <mesh
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
        receiveShadow
      >
        <planeGeometry />
        <meshStandardMaterial color="#4783fb" />
      </mesh>
    </>
  );
}

export default Render;
