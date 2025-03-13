"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../../page.module.css";
import "./style.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import Render from "./Render";

function Page() {
  const cameraSettings = {
    fov: 45,
    zoom: 50,
    near: 0.1,
    far: 200,
    position: [3, 2, 6],
  };

  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="load-a-model-r3f 햄부기햄북" />
      {/* @ts-ignore */}
      <Canvas orthographic camera={cameraSettings} shadows>
        <Render />
        <color args={["#ddff00"]} attach="background" />
      </Canvas>
    </div>
  );
}

export default Page;
