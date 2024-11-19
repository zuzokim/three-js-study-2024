"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../../page.module.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";
import { Timer } from "three/addons/misc/Timer.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

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

      const parameters = { count: 100, size: 0.05, radius: 5, branches: 3 };

      const generateGalaxy = () => {
        /**
         * Geometry
         */
        const geometry = new THREE.BufferGeometry();

        //@ts-ignore
        const positions = new Float32Array(parameters.count * 3);

        //@ts-ignore
        // for (let i = 0; i < parameters.count; i++) {
        //   const i3 = i * 3;

        //   positions[i3] = (Math.random() - 0.5) * 3;
        //   positions[i3 + 1] = (Math.random() - 0.5) * 3;
        //   positions[i3 + 2] = (Math.random() - 0.5) * 3;
        // }

        // for (let i = 0; i < parameters.count; i++) {
        //   const i3 = i * 3;

        //   const radius = Math.random() * parameters.radius;

        //   positions[i3] = radius;
        //   positions[i3 + 1] = 0;
        //   positions[i3 + 2] = 0;
        // }

        for (let i = 0; i < parameters.count; i++) {
          const i3 = i * 3;

          const radius = Math.random() * parameters.radius;

          const branchAngle =
            //012
            ((i % parameters.branches) /
              //브랜치 갯수
              parameters.branches) *
            //360도
            Math.PI *
            2;

          const degree90 = Math.PI / 2;
          const degree45 = Math.PI / 4;
          //각도
          let radian = Math.random() * Math.PI * 2;

          const x = Math.cos(radian) * parameters.radius * Math.random(); // 넓이 조정하려면 radius만큼
          const y = Math.sin(radian) * parameters.radius * Math.random();

          positions[i3] = x;
          positions[i3 + 1] = y;
          positions[i3 + 2] = y;
        }

        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );

        /**
         * Material
         */
        const material = new THREE.PointsMaterial({
          size: parameters.size,
          sizeAttenuation: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        /**
         * Points
         */
        const points = new THREE.Points(geometry, material);
        scene.add(points);
      };
      generateGalaxy();

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
      camera.position.x = -2;
      camera.position.y = 3;
      camera.position.z = 8;
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
      // const clock = new THREE.Clock();
      const timer = new Timer();

      const tick = () => {
        // Timer
        timer.update();
        const elapsedTime = timer.getElapsed();

        const axedHelper = new THREE.AxesHelper();
        scene.add(axedHelper);

        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);
        // renderer.shadowMap.enabled = true;

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
      <PageTitle title="galaxy-generator" />
      <canvas style={{ display: "block" }} ref={el}></canvas>
    </div>
  );
}

export default Page;
