"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import HomeButton from "../../components/HomeButton";
import PageTitle from "../../components/PageTitle";
import styles from "../../page.module.css";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    el.current.innerHTML = "";

    const scene = new THREE.Scene();

    // rotate 90
    const vector = new THREE.Vector3(0.5, 0.5, 0);

    const m = new THREE.Matrix3(
      Math.cos(Math.PI / 2),
      -Math.sin(Math.PI / 2),
      0,
      Math.sin(Math.PI / 2),
      Math.cos(Math.PI / 2),
      0,
      0,
      0,
      1
    );

    vector.applyMatrix3(m);

    const arrowHelper = new THREE.ArrowHelper(
      vector.clone().normalize(),
      new THREE.Vector3(0, 0, 0),
      vector.length(),
      0xff0000
    );

    scene.add(arrowHelper);

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.x = 2;
    camera.position.y = 2;
    camera.position.z = 2;
    scene.add(camera);

    const controls = new OrbitControls(camera, el!.current);
    controls.enableDamping = true;

    const axesHelper = new THREE.AxesHelper(4);
    scene.add(axesHelper);

    const renderer = new THREE.WebGLRenderer({
      canvas: el.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let requestId: number;

    function tick() {
      renderer.render(scene, camera);
      controls.update();
      camera.lookAt(arrowHelper.position);
      requestId = window.requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="vector-class-basis-rotate" />
      <canvas style={{ display: "block" }} ref={el}></canvas>
    </div>
  );
}
export default Page;
