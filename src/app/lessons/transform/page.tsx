"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import HomeButton from "../../components/HomeButton";
import PageTitle from "../../components/PageTitle";
import styles from "../../page.module.css";

function Page() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!el.current) {
      return;
    }
    el.current.innerHTML = "";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ffee });
    const cube1 = new THREE.Mesh(geometry, material1);
    cube1.position.x = -1.5;
    scene.add(cube1);

    const material2 = new THREE.MeshBasicMaterial({ color: 0xffeeee });
    const cube2 = new THREE.Mesh(geometry, material2);
    cube2.position.x = 0;
    scene.add(cube2);

    const material3 = new THREE.MeshBasicMaterial({ color: 0xee00ff });
    const cube3 = new THREE.Mesh(geometry, material3);
    cube3.position.x = 1.5;
    scene.add(cube3);

    const axedHelper = new THREE.AxesHelper();
    scene.add(axedHelper);

    camera.position.z = 5;
    camera.position.y = 1;
    camera.position.x = 1;

    renderer.render(scene, camera);
  }, []);
  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="transform" />
      <div ref={el}></div>
    </div>
  );
}

export default Page;
