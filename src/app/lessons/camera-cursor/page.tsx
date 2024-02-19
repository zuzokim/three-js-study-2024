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

    const cursor = {
      X: 0,
      Y: 0,
    };

    el.current?.addEventListener("mousemove", (e) => {
      cursor.X = e.clientX / window.innerWidth - 0.5;

      cursor.Y = -(e.clientY / window.innerHeight - 0.5);
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      //field of view
      75,
      //aspect ratio
      window.innerWidth / window.innerHeight,
      //near
      0.1,
      //far
      100
    );
    // const aspectRatio = window.innerWidth / window.innerHeight;
    // const camera = new THREE.OrthographicCamera(
    //   -1 * aspectRatio,
    //   1 * aspectRatio,
    //   1,
    //   -1,
    //   0.1,
    //   100
    // );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xff7700 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const axedHelper = new THREE.AxesHelper();
    scene.add(axedHelper);

    camera.position.z = 3;
    camera.lookAt(cube.position);

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      cube.rotation.y += 0.005;
      camera.position.x = cursor.X * 3;
      camera.position.y = cursor.Y * 3;
      // camera.lookAt(new THREE.Vector3()); //0,0,0 cube
      camera.lookAt(cube.position);

      renderer.render(scene, camera);
    }

    animate();
  }, []);
  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="camera-cursor" />
      <div ref={el}></div>
    </div>
  );
}

export default Page;
