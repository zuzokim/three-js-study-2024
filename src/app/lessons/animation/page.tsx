"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import HomeButton from "../../components/HomeButton";
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
    const material = new THREE.MeshBasicMaterial({ color: 0x0077dd });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const axedHelper = new THREE.AxesHelper();
    scene.add(axedHelper);

    camera.position.z = 5;
    camera.position.y = 1;
    camera.position.x = 1;

    renderer.render(scene, camera);

    //previous time
    let time = Date.now();
    

    function animate() {
      /**call it on the next frame!
       * if it's on a high frame rate computer screen,
       * it will be called more frequently.
       */
      window.requestAnimationFrame(animate);

      const currentTime = Date.now();
      /**deltaTime would be shorter if the frame rate is high.*/
      const deltaTime = currentTime - time;
      time = currentTime;

      /**animate at the same speed regardless of the fps */
      cube.rotation.x += 0.005 * deltaTime;
      cube.rotation.y += 0.03 * deltaTime;

      renderer.render(scene, camera);
    }

    animate();
  }, []);
  return (
    <div className={styles.page}>
      <HomeButton />
      <div ref={el}></div>
    </div>
  );
}

export default Page;
