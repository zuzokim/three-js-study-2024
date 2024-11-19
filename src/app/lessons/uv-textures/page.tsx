/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../../page.module.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    el.current.innerHTML = "";
    // Scene
    const scene = new THREE.Scene();

    const geometry = new THREE.BufferGeometry();
    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    console.log(planeGeometry, "attbutes");

    // prettier-ignore
    const positionArray = new Float32Array([
      -0.5, 0.5, 0, //0 indices
      0.5, 0.5, 0, //1
      -0.5, -0.5, 0, //2
      0.5, -0.5, 0 //3
    ]);
    const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
    geometry.setAttribute("position", positionAttribute);

    const indices = [0, 2, 1, 2, 3, 1];
    geometry.setIndex(indices);

    // TODO: uvArray를 작성해줘
    // prettier-ignore
    const uvArray = new Float32Array([
      // TODO:

 0,0,
 1,0,
 0,1,
1,1
    ]);
    const uvAttribute = new THREE.BufferAttribute(uvArray, 2);
    planeGeometry.setAttribute("uv", uvAttribute);

    const textureLoader = new THREE.TextureLoader();

    const { pathname } = new URL("./textures/kirby.png", import.meta.url);
    const colorTexture = textureLoader.load(pathname);

    const material = new THREE.MeshBasicMaterial({
      map: colorTexture,
      // wireframe: true,
    });
    const mesh = new THREE.Mesh(planeGeometry, material);
    scene.add(mesh);

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.z = 3;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, el.current);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: el.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Animate
    const clock = new THREE.Clock();

    let requestId: number;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      requestId = window.requestAnimationFrame(tick);
    };

    tick();
    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="uv-textures" />
      <canvas style={{ display: "block" }} ref={el}></canvas>
    </div>
  );
}

export default Page;
