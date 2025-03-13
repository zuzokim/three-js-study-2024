import { useAnimations, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect } from "react";

export const Fox = () => {
  const fox = useGLTF("/static/Fox.gltf");

  const animations = useAnimations(fox.animations, fox.scene);

  const { animationName } = useControls({
    animationName: { options: animations.names },
  });

  useEffect(() => {
    const action = animations.actions[animationName];
    action?.reset().fadeIn(0.5).play();

    return () => {
      action?.fadeOut(0.5);
    };
  }, [animationName, animations.actions]);

  return <primitive object={fox.scene} scale={0.1} />;
};

export const Fallback = (props: any) => {
  return (
    <mesh position-y={0.5} scale={[2, 3, 2]} {...props}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
      <meshBasicMaterial wireframe color="blue" />
    </mesh>
  );
};

useGLTF.preload("/static/Fox.gltf");

//https://gltf.pmnd.rs/
