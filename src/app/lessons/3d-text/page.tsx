"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../../page.module.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

function Page() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }
    el.current.innerHTML = "";

    //Solution1.
    // const image = new Image();
    // const texture = new THREE.Texture(image);
    // texture.colorSpace = THREE.SRGBColorSpace;

    // image.onload = () => {
    //   texture.needsUpdate = true;
    // };

    // image.src = "../textures/door/color.jpg";

    //Solution2.
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onStart = () => {
      console.log("onLoaded");
    };
    loadingManager.onProgress = () => {
      console.log("onProgress");
    };
    loadingManager.onError = () => {
      console.log("onError");
    };
    const fontLoader = new FontLoader();

    fontLoader.load(
      new URL("./fonts/Sixtyfour_Regular.json", import.meta.url).href,
      (font) => {
        console.log("loaded");

        const textGeometry = new TextGeometry("Kirby JJang", {
          font: font,
          size: 0.5,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.001,
          bevelSize: 0.01,
          bevelOffset: 0,
          bevelSegments: 5,
          depth: 1,
        });
        const textMaterial = new THREE.MeshBasicMaterial();
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.x = -3;
        scene.add(text);
      }
    );

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

    const controls = new OrbitControls(camera, el.current);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.current.appendChild(renderer.domElement);

    const axedHelper = new THREE.AxesHelper();
    scene.add(axedHelper);

    camera.position.z = 3;
    // camera.lookAt(cube.position);

    function animate() {
      requestAnimationFrame(animate);

      // cube.rotation.x += 0.0005;

      /**update controls for smooth damping  */
      controls.update();

      renderer.render(scene, camera);
    }

    animate();
  }, []);

  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="3d-text" />
      <div style={{ display: "block" }} ref={el}></div>
    </div>
  );
}

export default Page;