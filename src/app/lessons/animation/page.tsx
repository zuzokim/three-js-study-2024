"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import HomeButton from "../../components/HomeButton";
import styles from "../../page.module.css";

import gsap from "gsap";

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

    const geometry2 = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material2 = new THREE.MeshBasicMaterial({ color: 0x0033ff });
    const cube2 = new THREE.Mesh(geometry2, material2);
    cube2.position.x = 1.5;
    scene.add(cube2);

    const axedHelper = new THREE.AxesHelper();
    scene.add(axedHelper);

    camera.position.z = 5;
    camera.position.y = 1;
    camera.position.x = 1;

    renderer.render(scene, camera);

    //previous time
    let time = Date.now();
    const clock = new THREE.Clock();

    /**even if gasp is used to animate, render still need to be called with requestAnmiationFrame */
    // gsap.to(cube.position, { duration: 1, delay: 1, x: 2, y: 2 });
    // gsap.to(cube.position, { duration: 1, delay: 2, x: 0 });

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

      //clock second starts from 0 on the first render.
      const elapsedTime = clock.getElapsedTime();

      /**animate at the same speed regardless of the fps */
      cube.rotation.x += 0.005 * deltaTime;
      cube.rotation.y = elapsedTime * Math.PI * 2; // rotate360
      cube.position.x = Math.sin(elapsedTime * Math.PI);
      cube.position.y = Math.cos(elapsedTime * Math.PI);

      cube2.rotation.x += 0.005 * deltaTime;
      cube2.rotation.y = elapsedTime * Math.PI * 2; // rotate360
      cube2.position.x = Math.sin(elapsedTime * Math.PI * 2);
      cube2.position.y = Math.cos(elapsedTime * Math.PI * 2);

      camera.position.y = Math.cos(elapsedTime);
      /** look at cube, not cube2 */
      camera.lookAt(cube.position);
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
