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
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(1, 1, 0);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 4096;
      directionalLight.shadow.mapSize.height = 4096;
      directionalLight.shadow.camera.near = 1;
      directionalLight.shadow.camera.far = 5;

      scene.add(directionalLight);

      const directionalLightHelper = new THREE.DirectionalLightHelper(
        directionalLight
      );
      directionalLightHelper.visible = false;
      scene.add(directionalLightHelper);

      // Spot light
      const spotLight = new THREE.SpotLight(
        0x784400,
        4.5,
        10,
        Math.PI * 0.2,
        0.25,
        1
      );
      spotLight.position.set(1, 3, 5);
      scene.add(spotLight);

      spotLight.target.position.x = 2.2;
      scene.add(spotLight.target);

      // Point light
      const pointLight = new THREE.PointLight(0xffffff, 10, 6, 2);
      pointLight.position.set(2, 2.5, 1);
      scene.add(pointLight);

      const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
      scene.add(pointLightHelper);

      const material = new THREE.MeshStandardMaterial({});

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 64, 64),
        material
      );
      // sphere.position.x = -1;
      sphere.castShadow = true;

      /**
       * Textures
       */
      const textureLoader = new THREE.TextureLoader();

      const bakedTexture = new URL(
        "./textures/bakedShadow.jpg",
        import.meta.url
      );

      const simpleTexture = new URL(
        "./textures/simpleShadow.jpg",
        import.meta.url
      );

      const bakedShadow = textureLoader.load(bakedTexture.pathname);
      const simpleShadow = textureLoader.load(simpleTexture.pathname);

      // plane
      const bottomPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 100, 100),
        material
        // new THREE.MeshBasicMaterial({
        //   // map: bakedShadow,
        // })
      );

      const sphereShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8, 10, 10),
        new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
        })
      );


      bottomPlane.rotateX(-Math.PI / 2);
      bottomPlane.position.y = -0.6;
      bottomPlane.receiveShadow = true;

      sphereShadow.rotateX(-Math.PI / 2);
      sphereShadow.position.y = -0.5;
      sphereShadow.receiveShadow = true;

      scene.add(sphere, bottomPlane, sphereShadow);

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
      renderer.shadowMap.enabled = false;
      // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      // renderer.shadowMap.type = THREE.PCFShadowMap
      // renderer.shadowMap.type = THREE.VSMShadowMap;

      /**
       * Animate
       */
      const clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        sphere.rotation.y = elapsedTime * (Math.PI * 0.2);

        sphere.position.y = Math.abs(Math.abs(Math.sin(elapsedTime * 3)));
        // box.rotation.y = elapsedTime * (Math.PI * 0.2);
        // torus.rotation.y = elapsedTime * (Math.PI * 0.2);

        sphere.rotation.x = elapsedTime * (Math.PI * 0.1);
        // box.rotation.x = elapsedTime * (Math.PI * 0.1);
        // torus.rotation.x = elapsedTime * (Math.PI * 0.1);

        sphereShadow.position.x = sphere.position.x;
        sphereShadow.position.y = sphere.position.y;
        sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

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
      <PageTitle title="shadow" />
      <canvas style={{ display: "block" }} ref={el}></canvas>;
    </div>
  );
}

export default Page;
