"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/Addons.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import styles from "../../page.module.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;

    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = "";

      const canvas = el.current;
      // Scene
      const scene = new THREE.Scene();

      // Lights

      // Ambient light
      // const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      // scene.add(ambientLight);

      // Directional light
      // const directionalLight = new THREE.DirectionalLight(0x00fcfc, 0.3);
      // directionalLight.position.set(-1, 0.5, -1);
      // scene.add(directionalLight);

      // Hemisphere light
      // const hemisphereLight = new THREE.HemisphereLight(
      //   0xffdd00,
      //   0x0000ff,
      //   0.9
      // );
      // scene.add(hemisphereLight);

      // Point light
      const pointLight = new THREE.PointLight(0x22ff00, 10, 6, 2);
      pointLight.position.set(-1, 0, 1);
      scene.add(pointLight);

      // React area light
      // const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
      // // rectAreaLight.position.set(-1, 0, 1);
      // rectAreaLight.lookAt(0, 0, 0);
      // scene.add(rectAreaLight);

      // Spot light
      const spotLight = new THREE.SpotLight(
        0x784400,
        4.5,
        10,
        Math.PI * 0.2,
        0.25,
        1
      );
      spotLight.position.set(0, 2, 3);
      scene.add(spotLight);

      spotLight.target.position.x = 2.2;
      scene.add(spotLight.target);

      // const hemisphereLightHelper = new THREE.HemisphereLightHelper(
      //   hemisphereLight,
      //   0.2
      // );
      // scene.add(hemisphereLightHelper);

      // const directionalLightHelper = new THREE.DirectionalLightHelper(
      //   directionalLight,
      //   0.2
      // );
      // scene.add(directionalLightHelper);

      const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
      scene.add(pointLightHelper);

      const spotLightHelper = new THREE.SpotLightHelper(spotLight);
      scene.add(spotLightHelper);

      const material = new THREE.MeshStandardMaterial({});

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 64, 64),
        material
      );
      sphere.position.x = -1.5;

      // box
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1, 100, 100),
        material
      );

      // torus

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.2, 64, 128),
        material
      );
      torus.position.x = 1.5;

      // plane
      const bottomPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 100, 100),
        material
      );

      bottomPlane.rotateX(-Math.PI / 2);
      bottomPlane.position.y = -2;

      scene.add(sphere, box, torus, bottomPlane);

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
      // Base camera
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        100
      );
      camera.position.x = 1;
      camera.position.y = 1;
      camera.position.z = 2;
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      /**
       * Animate
       */
      const clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        sphere.rotation.y = elapsedTime * (Math.PI * 0.2);
        box.rotation.y = elapsedTime * (Math.PI * 0.2);
        torus.rotation.y = elapsedTime * (Math.PI * 0.2);

        sphere.rotation.x = elapsedTime * (Math.PI * 0.1);
        box.rotation.x = elapsedTime * (Math.PI * 0.1);
        torus.rotation.x = elapsedTime * (Math.PI * 0.1);

        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
      };

      tick();
    }
    main();

    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="light" />
      <canvas style={{ display: "block" }} ref={el}></canvas>
    </div>
  );
}

export default Page;
