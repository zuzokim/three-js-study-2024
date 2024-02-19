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
    // const camera = new THREE.PerspectiveCamera(
    //   //field of view
    //   75,
    //   //aspect ratio
    //   window.innerWidth / window.innerHeight,
    //   //near
    //   0.1,
    //   //far
    //   100
    // );
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -1 * aspectRatio,
      1 * aspectRatio,
      1,
      -1,
      0.1,
      100
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const axedHelper = new THREE.AxesHelper();
    scene.add(axedHelper);

    camera.position.z = 2;
    camera.position.y = 2;
    camera.position.x = 2;
    camera.lookAt(cube.position);

    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.y += 0.005;

      renderer.render(scene, camera);
    }

    animate();
  }, []);
  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="camera" />
      <div ref={el}></div>
    </div>
  );
}

export default Page;
