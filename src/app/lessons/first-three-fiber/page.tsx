"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../../page.module.css";
import "./style.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";
import { Canvas } from "@react-three/fiber";
import Render from "./Render";

function Page() {
  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="first-three-fiber" />
      <Canvas>
        <Render />
      </Canvas>
    </div>
  );
}

export default Page;
