"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../../page.module.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";
import { Timer } from "three/addons/misc/Timer.js";

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

      const parameters = {
        count: 5000,
        size: 0.03,
        radius: 5,
        branches: 3,
        random: 0.5,
        pow: 1,
        insideColor: "#0858f8",
        outsideColor: "#940eed",
      };

      const generateGalaxy = () => {
        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        /**
         * Geometry
         */
        const geometry = new THREE.BufferGeometry();

        //@ts-ignore
        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);

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
          // let radian = Math.random() * Math.PI * 2;

          const radius = Math.random() * parameters.radius;

          const x =
            Math.cos(branchAngle + radius) * radius +
            //0 ~ 1 양수만 주면 회오리가 기울어 보임. -0.5 ~ 0.5로 맞춰서 중앙에서 좌우로 균일한 랜덤값을 줌
            Math.pow(Math.random() - 0.5, parameters.pow) *
              radius *
              parameters.random;
          const y =
            Math.sin(branchAngle + radius) * radius +
            Math.pow(Math.random() - 0.5, parameters.pow) *
              radius *
              parameters.random;

          positions[i3] = x;
          positions[i3 + 1] =
            Math.pow(Math.random() - 0.5, parameters.pow) *
            radius *
            parameters.random *
            0.5;
          positions[i3 + 2] = y;

          // Color
          const mixedColor = colorInside.clone();
          mixedColor.lerp(colorOutside, radius / parameters.radius);

          colors[i3] = mixedColor.r;
          colors[i3 + 1] = mixedColor.g;
          colors[i3 + 2] = mixedColor.b;
        }

        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );

        /**color */

        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        /**
         * Material
         */
        const material = new THREE.PointsMaterial({
          size: parameters.size,
          sizeAttenuation: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexColors: true,
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
