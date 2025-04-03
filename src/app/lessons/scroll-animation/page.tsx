"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../../page.module.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";
import { Timer } from "three/addons/misc/Timer.js";
import "./scroll-animation-page.css";
import GUI from "lil-gui";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;

    // async function main() {
    if (!el.current) {
      return;
    }
    el.current.innerHTML = "";

    const canvas = el.current;

    // Scene
    const scene = new THREE.Scene();

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    /**
     * Camera
     */

    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);

    // Base camera
    const camera = new THREE.PerspectiveCamera(
      35,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.z = 6;
    scene.add(camera);

    /**
     * Objects
     */
    // // Meshes
    // const mesh1 = new THREE.Mesh(
    //   new THREE.TorusGeometry(1, 0.4, 16, 60),
    //   new THREE.MeshBasicMaterial({ color: "#95ff00" })
    // );
    // const mesh2 = new THREE.Mesh(
    //   new THREE.ConeGeometry(1, 2, 32),
    //   new THREE.MeshBasicMaterial({ color: "#95ff00" })
    // );
    // const mesh3 = new THREE.Mesh(
    //   new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    //   new THREE.MeshBasicMaterial({ color: "#95ff00" })
    // );

    // scene.add(mesh1, mesh2, mesh3);

    const parameters = { materialColor: "#95ff00" };

    const texture = new URL("./textures/gradients/3.jpg", import.meta.url);

    const textureLoader = new THREE.TextureLoader();

    const gradientTexture = textureLoader.load(texture.pathname);
    gradientTexture.magFilter = THREE.NearestFilter;
    // Material
    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: gradientTexture,
    });

    // Meshes
    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
    );

    const gui = new GUI();
    gui.addColor(material, "color");

    const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
    );

    const objectsDistance = 4;
    mesh1.position.y = -objectsDistance * 0;
    mesh2.position.y = -objectsDistance * 1;
    mesh3.position.y = -objectsDistance * 2;

    const sectionMeshes = [mesh1, mesh2, mesh3];

    scene.add(mesh1, mesh2, mesh3);

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Mousemove Event
     */
    const cursor = { x: 0, y: 0 };

    const onMouseMove = (event: any) => {
      cursor.x = event.clientX / sizes.width - 0.5;
      cursor.y = event.clientY / sizes.height - 0.5;
    };

    window.addEventListener("mousemove", onMouseMove);

    /**
     * Scroll
     */
    let scrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;

      console.log(scrollY);
    });

    /**
     * Animate
     */
    // const clock = new THREE.Clock();
    const timer = new Timer();
    let previousTime = 0;
    // let requestId = 0;

    const tick = () => {
      // Timer
      timer.update();
      const elapsedTime = timer.getElapsed();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      // Animate camera
      camera.position.y = (-scrollY / sizes.height) * objectsDistance;

      const parallaxX = cursor.x * 0.5;
      const parallaxY = -cursor.y * 0.5;

      cameraGroup.position.x +=
        (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
      cameraGroup.position.y +=
        (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

      // Animate meshes
      for (const mesh of sectionMeshes) {
        mesh.rotation.x = elapsedTime * 0.1;
        mesh.rotation.y = elapsedTime * 0.12;
      }

      // const axedHelper = new THREE.AxesHelper();
      // scene.add(axedHelper);

      // Render
      renderer.render(scene, camera);
      // renderer.shadowMap.enabled = true;

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
    // }
    // main();

    return () => {
      //@ts-ignore
      cancelAnimationFrame(requestId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  });

  return (
    // <div className={styles.page}>
    <>
      {/* <HomeButton />
      <PageTitle title="scroll-animation" /> */}
      {/* <div style={{ position: "relative", overflow: "auto" }}> */}
      <canvas className="webgl" style={{ display: "block" }} ref={el}></canvas>
      <section className="section">
        <h1>Hellow</h1>
      </section>
      <section className="section">
        <h2>안녕하세유</h2>
      </section>
      <section className="section">
        <h2>월화수목금퇼</h2>
      </section>
      {/* </div> */}
      {/* </div> */}
    </>
  );
}

export default Page;
