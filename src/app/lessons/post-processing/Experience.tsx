import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
  Vignette,
  ToneMapping,
  EffectComposer,
  Glitch,
  Noise,
  Bloom,
} from "@react-three/postprocessing";
import { BlendFunction, GlitchMode, ToneMappingMode } from "postprocessing";

export const Experience = () => {
  console.log(ToneMappingMode, "???");
  return (
    <>
      <color args={["#000"]} attach="background" />

      <EffectComposer multisampling={0}>
        <Glitch
          mode={GlitchMode.SPORADIC}
          //@ts-ignore
          delay={[0.5, 1]}
          //@ts-ignore
          duration={[0.1, 0.3]}
          //@ts-ignore
          strength={[0.2, 0.4]}
        />
        <Bloom luminanceThreshold={1.1} mipmapBlur intensity={2}/>
        <Noise blendFunction={BlendFunction.COLOR_DODGE} opacity={0.5} />
        <Vignette
          // offset={0.6}
          darkness={0.8}
          blendFunction={BlendFunction.NORMAL}
        />
        <ToneMapping mode={ToneMappingMode.UNCHARTED2} />
      </EffectComposer>

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial
          color="#fff"
          emissive="orange"
          emissiveIntensity={5}
        />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color={[1.5, 1, 4]} />
      </mesh>
      <mesh castShadow position-x={4} position-z={-2} position-y={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial
          color="skyblue"
          emissive="blue"
          emissiveIntensity={10}
        />
      </mesh>

      {/* <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh> */}
    </>
  );
};
