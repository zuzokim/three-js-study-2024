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

      const textureLoader = new THREE.TextureLoader();

      /**
       * Floor
       */
      const floorColorTexture = textureLoader.load(
        new URL(
          "./textures/bark_willow_02_4k.blend/textures/bark_willow_02_diff_4k.jpg",
          import.meta.url
        ).href
      );
      floorColorTexture.colorSpace = THREE.SRGBColorSpace;

      const floorNormalTexture = textureLoader.load(
        new URL(
          "./textures/bark_willow_02_4k.blend/textures/bark_willow_02_nor_gl_4k.exr",
          import.meta.url
        ).href
      );

      const floorAORoughnessMetalnessTexture = textureLoader.load(
        new URL(
          "./textures/bark_willow_02_4k.blend/textures/bark_willow_02_rough_4k.exr",
          import.meta.url
        ).href
      );

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        new THREE.MeshStandardMaterial({
          map: floorColorTexture,
          normalMap: floorNormalTexture,
          aoMap: floorAORoughnessMetalnessTexture,
          roughnessMap: floorAORoughnessMetalnessTexture,
          metalnessMap: floorAORoughnessMetalnessTexture,
        })
      );

      floor.rotation.x = -Math.PI * 0.5;
      floor.position.y = 0.2;

      scene.add(floor);

      /**
       * Wall
       */
      const wallColorTexture = textureLoader.load(
        new URL(
          "./textures/wood_trunk_wall_4k.blend/textures/wood_trunk_wall_diff_4k.jpg",
          import.meta.url
        ).href
      );

      wallColorTexture.colorSpace = THREE.SRGBColorSpace;

      const wallNormalTexture = textureLoader.load(
        new URL(
          "./textures/wood_trunk_wall_4k.blend/textures/wood_trunk_wall_nor_gl_4k.exr",
          import.meta.url
        ).href
      );

      const wallAORoughnessMetalnessTexture = textureLoader.load(
        new URL(
          "./textures/wood_trunk_wall_4k.blend/textures/wood_trunk_wall_rough_4k.exr",
          import.meta.url
        ).href
      );

      const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        new THREE.MeshStandardMaterial({
          map: wallColorTexture,
          normalMap: wallNormalTexture,
          aoMap: wallAORoughnessMetalnessTexture,
          roughnessMap: wallAORoughnessMetalnessTexture,
          metalnessMap: wallAORoughnessMetalnessTexture,
        })
      );

      wall.position.y = 4;
      wall.position.z = -4;
      scene.add(wall);

      //hdri
      /**
       * Loaders
       */
      // ...
      const rgbeLoader = new RGBELoader();

      // HDR (RGBE) equirectangular
      rgbeLoader.load(
        new URL("./textures/environmentMaps/0/2k.hdr", import.meta.url).href,
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

      // gui.add(scene, "environmentIntensity").min(0).max(10).step(0.001);
      // gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);
      // gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001);

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

          updateAllMaterials();
        }
      );

      /**
       * Directional light
       */
      const directionalLight = new THREE.DirectionalLight("#ffffff", 6);
      directionalLight.position.set(3, 7, 6);
      scene.add(directionalLight);

      // Helper
      const directionalLightCameraHelper = new THREE.CameraHelper(
        directionalLight.shadow.camera
      );
      scene.add(directionalLightCameraHelper);

      // Target
      directionalLight.target.position.set(0, 5, 0);
      // directionalLight.target.updateWorldMatrix(false, false);
      //or
      scene.add(directionalLight.target);
      directionalLight.shadow.camera.far = 15;
      directionalLight.shadow.mapSize.set(512, 512);
      directionalLight.position.set(-4, 6.5, 0);

      //모아레 현상 방지
      directionalLight.shadow.normalBias = 0.027;
      directionalLight.shadow.bias = -0.004;

      const updateAllMaterials = () => {
        scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            // ...

            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      };

      gui
        .add(directionalLight, "intensity")
        .min(0)
        .max(10)
        .step(0.001)
        .name("lightIntensity");
      gui
        .add(directionalLight.position, "x")
        .min(-10)
        .max(10)
        .step(0.001)
        .name("lightX");
      gui
        .add(directionalLight.position, "y")
        .min(-10)
        .max(10)
        .step(0.001)
        .name("lightY");
      gui
        .add(directionalLight.position, "z")
        .min(-10)
        .max(10)
        .step(0.001)
        .name("lightZ");

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
        //알리아싱
        antialias: true,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Tone mapping
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 2;

      // Shadows
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Shadows
      directionalLight.castShadow = true;
      gui.add(directionalLight, "castShadow");

      gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

      gui.add(renderer, "toneMapping", {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping,
      });

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
      //@ts-ignore
      cancelAnimationFrame(requestId);
    };
  });

  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="realistic-render" />
      <canvas style={{ display: "block" }} ref={el}></canvas>
    </div>
  );
}

export default Page;
