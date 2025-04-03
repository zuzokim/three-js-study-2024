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

    let requestId: number;

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

      // Base environment map
      const textureLoader = new THREE.TextureLoader();

      const environmentMap = textureLoader.load(
        new URL(
          "./textures/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg",
          import.meta.url
        ).href
      );
      environmentMap.mapping = THREE.EquirectangularReflectionMapping;
      environmentMap.colorSpace = THREE.SRGBColorSpace;

      scene.background = environmentMap;

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
          roughness: 0,
          metalness: 1,
          color: 0xaaaaaa,
        })
      );
      torusKnot.position.x = -4;
      torusKnot.position.y = 4;
      scene.add(torusKnot);

      // Holy donut
      const holyDonut = new THREE.Mesh(
        new THREE.TorusGeometry(8, 0.5),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
      );

      holyDonut.position.y = 3.5;

      //env만 비춰야하는데 자기 자신도 비추게 되는 무한루프처럼 보여서 한 레이어만 보여주도록 처리
      holyDonut.layers.enable(1);

      scene.add(holyDonut);

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

      // Cube render target
      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
        type: THREE.FloatType,
      });
      //scene에 타겟의 텍스쳐를 입힌다
      scene.environment = cubeRenderTarget.texture;

      // Cube camera
      const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
      //env만 비춰야하는데 자기 자신도 비추게 되는 무한루프처럼 보여서 한 레이어만 보여주도록 처리
      cubeCamera.layers.set(1);
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

        // Real time environment map
        if (holyDonut) {
          holyDonut.rotation.x = Math.sin(elapsedTime) * 2;

          cubeCamera.update(renderer, scene);
        }

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
      };

      tick();
    }
    main();

    return () => {
      //@ts-ignore
      cancelAnimationFrame(requestId);
    };
  });

  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="environment-map-realtime" />
      <canvas style={{ display: "block" }} ref={el}></canvas>
    </div>
  );
}

export default Page;
