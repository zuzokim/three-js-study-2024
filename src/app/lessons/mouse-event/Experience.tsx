import {
  OrbitControls,
  useGLTF,
  meshBounds,
  useHelper,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MeshBVHHelper } from "three-mesh-bvh";

export const Experience = () => {
  const cube = useRef(null);
  const cubeGeo = useRef(null);
  //@ts-ignore
  // useHelper(cubeGeo, MeshBVHHelper, "blue");

  const hamburger = useGLTF("/static/hamburger.glb");

  useFrame((state, delta) => {
    if (!cube.current) return;
    // @ts-ignore
    cube.current.rotation.y += delta * 0.2;
  });

  const eventHandler = () => {
    console.log("the event occured");
    if (!cube.current) return;
    //@ts-ignore
    cube.current.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
  };

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh
        position-x={-2}
        onPointerEnter={(event) => event.stopPropagation()}
        raycast={meshBounds}
      >
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh
        ref={cube}
        position-x={2}
        scale={1.5}
        onClick={eventHandler}
        onPointerEnter={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          document.body.style.cursor = "default";
        }}
        raycast={meshBounds}
      >
        <boxGeometry ref={cubeGeo} />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <group>
        <primitive
          object={hamburger.scene}
          scale={0.25}
          position-y={0.5}
          onClick={(event: any) => {
            console.log("click");
            event.stopPropagation(); //패티, 치즈, 상추, 소스, 빵 다 호출됨
          }}
          onPointerEnter={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerLeave={() => {
            document.body.style.cursor = "default";
          }}
        />
      </group>
    </>
  );
};
