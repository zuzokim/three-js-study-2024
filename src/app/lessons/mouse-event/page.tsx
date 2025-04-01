"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import styles from "../../page.module.css";
import "./style.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";
import { Canvas, useFrame } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { Experience } from "./Experience";
import { Bvh, useHelper } from "@react-three/drei";
import { MeshBVHHelper } from "three-mesh-bvh";

function Page() {

  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="mouse-event" />
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
        onPointerMissed={() => {
          console.log("You missed!");
        }}
      >
        {/* performance */}
        <Bvh>
          <Experience  />
        </Bvh>
      </Canvas>
    </div>
  );
}

export default Page;
