"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../../page.module.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;

    async function main() {
      // Debug
      const gui = new GUI();
      const debugObject = {};

      if (!el.current) {
        return;
      }
      el.current.innerHTML = "";

      const canvas = el.current;
      // Scene
      const scene = new THREE.Scene();

      /**
       * Models
       */
      const gltfLoader = new GLTFLoader();

      let mixer: any = null;
      gltfLoader.load(
        "/static/models/ai_made_banana_cat_gangnam_style/scene.gltf",
        (gltf) => {
          console.log("success");
          console.log(gltf);

          mixer = new THREE.AnimationMixer(gltf.scene);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();

          gltf.scene.children[0].scale.set(500, 500, 500);
          scene.add(gltf.scene.children[0]);
        },
        (progress) => {
          console.log("progress");
          console.log(progress);
        },
        (error) => {
          console.log("error");
          console.log(error);
        }
      );

      /**draco loader */
      // const dracoLoader = new DRACOLoader();

      // dracoLoader.setDecoderPath("/draco/");
      // //cdn 써도 됨
      // //dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
      // gltfLoader.setDRACOLoader(dracoLoader);

      /**
       * Floor
       */
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
          color: "#3902ff",
          metalness: 0.7,
          roughness: 1,
        })
      );
      floor.receiveShadow = true;
      floor.rotation.x = -Math.PI * 0.5;
      scene.add(floor);

      /**
       * Lights
       */
      const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.set(1024, 1024);
      directionalLight.shadow.camera.far = 15;
      directionalLight.shadow.camera.left = -7;
      directionalLight.shadow.camera.top = 7;
      directionalLight.shadow.camera.right = 7;
      directionalLight.shadow.camera.bottom = -7;
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Point light
      // const pointLight = new THREE.PointLight(0x22ff00, 20, 60, 2);
      // pointLight.position.set(-1, 0, 1);
      // scene.add(pointLight);

      const ghost1 = new THREE.PointLight("#f80d0d", 6);
      const ghost2 = new THREE.PointLight("#d0ff00", 6);
      const ghost3 = new THREE.PointLight("#f205fb", 6);
      scene.add(ghost1, ghost2, ghost3);

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
        0.4,
        1000
      );
      camera.position.set(2, 2, 2);
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, canvas);
      controls.target.set(0, 0.75, 0);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
      });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      /**
       * Animate
       */
      const clock = new THREE.Clock();
      let oldElapsedTime = 0;

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;

        //animation
        if (mixer) {
          mixer.update(deltaTime);
        }

        // Ghosts
        const ghost1Angle = elapsedTime * 15;
        ghost1.position.x = Math.cos(ghost1Angle) * 4;
        ghost1.position.z = Math.sin(ghost1Angle) * 4;
        ghost1.position.y =
          Math.sin(ghost1Angle) *
          Math.sin(ghost1Angle * 2.34) *
          Math.sin(ghost1Angle * 3.45);

        const ghost2Angle = -elapsedTime * 10;
        ghost2.position.x = Math.cos(ghost2Angle) * 6;
        ghost2.position.z = Math.sin(ghost2Angle) * 6;
        ghost2.position.y =
          Math.sin(ghost2Angle) *
          Math.sin(ghost2Angle * 2.34) *
          Math.sin(ghost2Angle * 3.45);

        const ghost3Angle = elapsedTime * 30;
        ghost3.position.z = Math.sin(ghost3Angle) * 4;
        ghost3.position.y = ghost3.position.x = Math.cos(ghost3Angle);
        Math.sin(ghost2Angle) *
          Math.sin(ghost2Angle * 2.34) *
          Math.sin(ghost2Angle * 3.45);

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
      <PageTitle title="model-load-animation" />
      <canvas style={{ display: "block" }} ref={el}></canvas>
    </div>
  );
}

export default Page;
