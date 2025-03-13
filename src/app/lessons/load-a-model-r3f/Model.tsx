import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Clone, useGLTF } from "@react-three/drei";

export const Model = () => {
  //   const model = useLoader(
  //     GLTFLoader,
  //     "/static/hamburger.glb"
  //   );

  const model = useGLTF("/static/hamburger.glb");
  const primitive = <primitive object={model.scene} />;

  return (
    <>
      <Clone object={model.scene} scale={0.35} position-x={-4} />
      <Clone object={model.scene} scale={0.35} position-x={0} />
      <Clone object={model.scene} scale={0.35} position-x={4} />
    </>
  );
};

export const Fallback = (props: any) => {
  return (
    <mesh position-y={0.5} scale={[2, 3, 2]} {...props}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
      <meshBasicMaterial wireframe color="blue" />
    </mesh>
  );
};

useGLTF.preload("/static/hamburger.glb");

//https://gltf.pmnd.rs/



