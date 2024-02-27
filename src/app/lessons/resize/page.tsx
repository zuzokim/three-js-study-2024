"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import HomeButton from "../../components/HomeButton";
import PageTitle from "../../components/PageTitle";
import styles from "../../page.module.css";

function Page() {
  const el = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  console.log("here");

  useEffect(() => {
    if (!el.current) {
      return;
    }
    el.current.innerHTML = "";

    const cursor = {
      X: 0,
      Y: 0,
    };

    // const sizes = {
    //   width: window.innerWidth,
    //   height: window.innerHeight,
    // };

    window.addEventListener("resize", () => {
      console.log("resize");
      // Update sizes
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);

      // Update camera
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    window.addEventListener("dblclick", () => {
      const fullscreenElement = document.fullscreenElement;
      // || document.webkitFullscreenElement;

      if (!fullscreenElement) {
        if (el.current?.requestFullscreen) {
          el.current?.requestFullscreen();
        }
        // else if (el.current?.webkitRequestFullscreen) {
        //   el.current?.webkitRequestFullscreen();
        // }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        // else if (document.webkitExitFullscreen) {
        // document.webkitExitFullscreen();
        // }
      }
    });

    el.current?.addEventListener("mousemove", (e) => {
      cursor.X = e.clientX / width - 0.5;

      cursor.Y = -(e.clientY / height - 0.5);
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      //field of view
      75,
      //aspect ratio
      width / height,
      //near
      0.1,
      //far
      100
    );

    const controls = new OrbitControls(camera, el.current);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xff99ee });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const axedHelper = new THREE.AxesHelper();
    scene.add(axedHelper);

    camera.position.z = 3;
    camera.lookAt(cube.position);

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.005;

      /**update controls for smooth damping  */
      controls.update();

      renderer.render(scene, camera);
    }

    animate();
  }, [height, width]);

  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="resize" />
      <div ref={el}></div>
    </div>
  );
}

export default Page;
