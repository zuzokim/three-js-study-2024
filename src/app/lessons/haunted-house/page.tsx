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

      // Sphere
      // const sphere = new THREE.Mesh(
      //   new THREE.SphereGeometry(1, 32, 32),
      //   new THREE.MeshStandardMaterial({ roughness: 0.7 })
      // );
      // sphere.position.y = 1;

      // House container
      const house = new THREE.Group();
      scene.add(house);

      // Walls
      const walls = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2.5, 4),
        new THREE.MeshStandardMaterial()
      );
      walls.position.y = 1.25; //2.5의 절반
      house.add(walls);

      // Roof
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3.5, 1.5, 4),
        new THREE.MeshStandardMaterial()
      );
      roof.position.y = 2.5 + 0.75; //walls의 y위치 + walls의 절반
      roof.rotation.y = Math.PI * 0.25;
      house.add(roof);

      // Door
      const door = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 2.2),
        new THREE.MeshStandardMaterial({ color: "red" })
      );
      door.position.y = 1;
      door.position.z = 2 + 0.001; //z-fighting 방지
      house.add(door);

      // Bushes
      const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
      const bushMaterial = new THREE.MeshStandardMaterial({ color: "green" });

      const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
      bush1.scale.set(0.5, 0.5, 0.5);
      bush1.position.set(0.8, 0.2, 2.2);

      const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
      bush2.scale.set(0.25, 0.25, 0.25);
      bush2.position.set(1.4, 0.1, 2.1);

      const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
      bush3.scale.set(0.4, 0.4, 0.4);
      bush3.position.set(-0.8, 0.1, 2.2);

      const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
      bush4.scale.set(0.15, 0.15, 0.15);
      bush4.position.set(-1, 0.05, 2.6);

      house.add(bush1, bush2, bush3, bush4);

      // Graves
      const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
      const graveMaterial = new THREE.MeshStandardMaterial();

      const graves = new THREE.Group();
      scene.add(graves);

      for (let i = 0; i < 30; i++) {
        // Mesh
        const grave = new THREE.Mesh(graveGeometry, graveMaterial);

        const angle = Math.random() * Math.PI * 2;
        const radius = 4 * Math.random() + 3; //집이 3정도니까 집 안에 안생기게 + 3
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const y = Math.random() - 0.25;

        grave.position.x = x;
        grave.position.z = z;
        grave.position.y = y;

        grave.rotation.x = (Math.random() - 0.5) * 0.4;
        grave.rotation.y = (Math.random() - 0.5) * 0.4;
        grave.rotation.z = (Math.random() - 0.5) * 0.4;

        // Add to the graves group
        graves.add(grave);
      }

      const textureLoader = new THREE.TextureLoader();

      const floorTexture = new URL(
        "./textures/floor/alpha.jpg",
        import.meta.url
      );

      const floorAlphaTexture = textureLoader.load(floorTexture.pathname);

      const floorTexture2 = new URL(
        "./textures/floor/rocky_terrain_diff_1k.jpg",
        import.meta.url
      );

      const floorColorTexture = textureLoader.load(floorTexture2.pathname);

      // const floorARMTexture = textureLoader.load(
      //   "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg"
      // );
      // const floorNormalTexture = textureLoader.load(
      //   "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg"
      // );
      // const floorDisplacementTexture = textureLoader.load(
      //   "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg"
      // );

      // Floor
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({
          alphaMap: floorAlphaTexture,
          transparent: true,
          map: floorColorTexture,
        })
      );

      // 바닥에 깔기
      floor.rotation.x = -Math.PI * 0.5; //90도 회전

      // Add Mesh to Scene
      scene.add(floor);

      /**
       * Lights
       */
      // Ambient light
      const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
      scene.add(ambientLight);

      // Directional light
      const directionalLight = new THREE.DirectionalLight("#ffffff", 1.5);
      directionalLight.position.set(3, 2, -8);
      scene.add(directionalLight);

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
      camera.position.x = 5;
      camera.position.y = 5;
      camera.position.z = 4;
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
      <PageTitle title="haunted-house" />
      <canvas style={{ display: "block" }} ref={el}></canvas>;
    </div>
  );
}

export default Page;
