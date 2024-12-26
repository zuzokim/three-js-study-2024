"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../../page.module.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GroundedSkybox } from "three/addons/objects/GroundedSkybox.js";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gui = new GUI();
    const debugObject = {};

    let requestId: number;

    const objectsToUpdate: any[] = [];

    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = "";

      const canvas = el.current;
      // Scene
      const scene = new THREE.Scene();

      /**
       * Textures
       */

      // const cubeTextureLoader = new THREE.CubeTextureLoader();

      // const environmentMapTexture = cubeTextureLoader.load([
      //   new URL("./textures/environmentMaps/2/px.png", import.meta.url).href,
      //   new URL("./textures/environmentMaps/2/nx.png", import.meta.url).href,
      //   new URL("./textures/environmentMaps/2/py.png", import.meta.url).href,
      //   new URL("./textures/environmentMaps/2/ny.png", import.meta.url).href,
      //   new URL("./textures/environmentMaps/2/pz.png", import.meta.url).href,
      //   new URL("./textures/environmentMaps/2/nz.png", import.meta.url).href,
      // ]);

      // scene.background = environmentMapTexture;
      // scene.environment = environmentMapTexture;

      //hdri
      /**
       * Loaders
       */
      // ...
      const rgbeLoader = new RGBELoader();

      // HDR (RGBE) equirectangular
      rgbeLoader.load(
        new URL(
          "./textures/environmentMaps/M3_Fantasy_hdri-hdr_a_huge_chocolate_factory_426147493_12736762.hdr",
          import.meta.url
        ).href,
        (environmentMap) => {
          // console.log(environmentMap);

          environmentMap.mapping = THREE.EquirectangularReflectionMapping;

          // scene.background = environmentMap;
          scene.environment = environmentMap;

          // Skybox
          const skybox = new GroundedSkybox(environmentMap, 15, 70);
          skybox.position.y = 15;
          // skybox.material.wireframe = true;//바닥이 평평하게
          scene.add(skybox);
        }
      );

      /**
       * Environment map
       */
      //@ts-ignore
      scene.environmentIntensity = 1;
      scene.backgroundBlurriness = 0;
      scene.backgroundIntensity = 1;

      //@ts-ignore
      // scene.backgroundRotation.x = 1;
      //@ts-ignore
      // scene.environmentRotation.x = 2;

      gui.add(scene, "environmentIntensity").min(0).max(10).step(0.001);
      gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);
      gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001);

      gui
        //@ts-ignore
        .add(scene.backgroundRotation, "y")
        .min(0)
        .max(Math.PI * 2)
        .step(0.001)
        .name("backgroundRotationY");
      gui
        //@ts-ignore
        .add(scene.environmentRotation, "y")
        .min(0)
        .max(Math.PI * 2)
        .step(0.001)
        .name("environmentRotationY");

      /**
       * Torus Knot
       */
      const torusKnot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
        //texture에 반응하도록 basic => standard
        new THREE.MeshStandardMaterial({
          roughness: 0.3,
          metalness: 1,
          color: 0xaaaaaa,
        })
      );
      torusKnot.position.x = -4;
      torusKnot.position.y = 4;
      scene.add(torusKnot);

      /**
       * Loaders
       */
      const gltfLoader = new GLTFLoader();

      /**
       * Models
       */
      gltfLoader.load(
        "/static/environment-map/models/FlightHelmet/glTF/FlightHelmet.gltf",
        (gltf) => {
          // console.log(gltf);
          gltf.scene.scale.set(10, 10, 10);
          scene.add(gltf.scene);
        }
      );

      /**
       * Sizes
       */
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
      camera.position.set(4, 5, 4);
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, canvas);
      controls.target.y = 3.5;
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
      <PageTitle title="environment-map" />
      <canvas style={{ display: "block" }} ref={el}></canvas>
    </div>
  );
}

export default Page;
