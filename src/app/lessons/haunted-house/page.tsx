"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../../page.module.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";
import { Timer } from "three/addons/misc/Timer.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
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

      // Sphere
      // const sphere = new THREE.Mesh(
      //   new THREE.SphereGeometry(1, 32, 32),
      //   new THREE.MeshStandardMaterial({ roughness: 0.7 })
      // );
      // sphere.position.y = 1;

      const textureLoader = new THREE.TextureLoader();

      const floorTexture = new URL(
        "./textures/floor/alpha.jpg",
        import.meta.url
      );

      const floorAlphaTexture = textureLoader.load(floorTexture.pathname);

      const floorTexture2 = new URL(
        "./textures/floor/snow_02_diff_1k.jpg",
        import.meta.url
      );

      const floorColorTexture = textureLoader.load(floorTexture2.pathname);
      floorColorTexture.repeat.set(8, 8);
      floorColorTexture.wrapS = THREE.RepeatWrapping;
      floorColorTexture.wrapT = THREE.RepeatWrapping;

      const floorTexture3 = new URL(
        "./textures/floor/snow_02_disp_1k.png",
        import.meta.url
      );

      const floorDisplacementTexture = textureLoader.load(
        floorTexture3.pathname
      );

      // House container
      const house = new THREE.Group();
      scene.add(house);

      // Walls
      const walls = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2.5, 4),
        new THREE.MeshStandardMaterial({ color: "#d53fe6" })
      );
      walls.position.y = 1.25; //2.5의 절반
      house.add(walls);

      // Roof
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3.5, 1.5, 4),
        new THREE.MeshStandardMaterial({
          color: "#390ceb",
        })
      );
      roof.position.y = 2.5 + 0.75; //walls의 y위치 + walls의 절반
      roof.rotation.y = Math.PI * 0.25;
      house.add(roof);

      // Door
      const door = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 2.2),
        new THREE.MeshStandardMaterial({ color: "#e0a21b" })
      );
      door.position.y = 1;
      door.position.z = 2 + 0.001; //z-fighting 방지
      house.add(door);

      // Door light
      const doorLight = new THREE.PointLight("#9bb5f3", 3);
      doorLight.position.set(0, 2.2, 2.5);
      house.add(doorLight);

      const ghost1 = new THREE.PointLight("#08566f", 6);
      const ghost2 = new THREE.PointLight("#2f00ff", 6);
      const ghost3 = new THREE.PointLight("#000000", 6);
      scene.add(ghost1, ghost2, ghost3);

      // Bushes
      const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
      const bushMaterial = new THREE.MeshStandardMaterial({ color: "#085937" });

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

      //Snowman

      const loader = new OBJLoader();

      const snowmanModel = new URL(
        "./models/snowman_final.obj",
        import.meta.url
      );

      const carrot = new URL("./textures/snowman/Carrot.jpg", import.meta.url);
      const carrotTexture = textureLoader.load(carrot.pathname);

      const blackFelt = new URL(
        "./textures/snowman/black_felt.jpg",
        import.meta.url
      );
      const blackFeltTexture = textureLoader.load(blackFelt.pathname);

      const charcoal = new URL(
        "./textures/snowman/charcoal.jpg",
        import.meta.url
      );
      const charcoalTexture = textureLoader.load(charcoal.pathname);

      const branch = new URL(
        "./textures/snowman/branch_texture.jpg",
        import.meta.url
      );
      const branchTexture = textureLoader.load(charcoal.pathname);

      let snowmanObject: THREE.Object3D | null = null;

      loader.load(
        snowmanModel.pathname, // Replace with the path to your .obj file
        (object: any) => {
          // Called when the resource is loaded
          object.scale.set(0.4, 0.4, 0.4);
          object.position.set(-2, 1, 4);
          object.traverse((child: any) => {
            if (child.isMesh) {
              if (child.name === "snowman_Sphere_Carrot") {
                child.material.map = carrotTexture;
              }
              if (child.name === "hat_Cylinder.002_hat") {
                child.material.map = blackFeltTexture;
              }
              if (child.name === "hat_Cylinder.002_hat_color") {
                child.material.map = blackFeltTexture;
              }
              if (child.name === "snowman_Sphere_charcoal") {
                child.material.map = charcoalTexture;
              }
              if (child.name === "charcoal_eyes_Sphere.004_charcoal") {
                child.material.map = charcoalTexture;
              }
              // if ((child.name = "arms_Cylinder_branch")) {
              //   child.material.map = branchTexture;
              // }
              //               snowman_Sphere_snow name
              // page.tsx:145 snowman_Sphere_Carrot name
              // page.tsx:145 snowman_Sphere_charcoal name
              // page.tsx:145 arms_Cylinder_branch name
              // page.tsx:145 charcoal_eyes_Sphere.004_charcoal name
              // page.tsx:145 hat_Cylinder.002_hat name
              // page.tsx:145 hat_Cylinder.002_hat_color name
              // child.material.map = snowmanTexture; // Apply the texture to the material
            }
          });
          scene.add(object);
          snowmanObject = object;
        },
        (xhr: any) => {
          // Called while loading is progressing
          // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error: any) => {
          // Called when loading has errors
          console.error("An error happened", error);
        }
      );

      // const snowmanGroup = new THREE.Group();
      // scene.add(snowmanGroup);
      // const snowmanGeometry = new THREE.SphereGeometry(1, 16, 16);
      // const snowmanMaterial = new THREE.MeshStandardMaterial({
      //   color: "white",
      // });

      // const snowman = new THREE.Mesh(snowmanGeometry, snowmanMaterial);
      // snowman.scale.set(0.7, 0.7, 0.7);
      // snowman.position.set(2.8, 0.3, 4.5);

      // const snowmanhead = new THREE.Mesh(snowmanGeometry, snowmanMaterial);
      // snowmanhead.scale.set(0.4, 0.4, 0.4);
      // snowmanhead.position.set(2.8, 1.2, 4.5);

      // snowmanGroup.add(snowman, snowmanhead);

      // Graves
      const graveGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
      const graveMaterial = new THREE.MeshStandardMaterial({ color: "red" });

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

      // Floor
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({
          alphaMap: floorAlphaTexture,
          transparent: true,
          map: floorColorTexture,
          displacementMap: floorDisplacementTexture,
          displacementScale: 0.8,
          displacementBias: -0.5,
        })
      );

      // 바닥에 깔기
      floor.rotation.x = -Math.PI * 0.5; //90도 회전

      // Add Mesh to Scene
      scene.add(floor);

      /**
       * Sky
       */
      // const sky = new Sky();
      // sky.scale.set(100, 100, 100);
      // scene.add(sky);

      // sky.material.uniforms["turbidity"].value = 10;
      // sky.material.uniforms["rayleigh"].value = 5;
      // sky.material.uniforms["mieCoefficient"].value = 0.1;
      // sky.material.uniforms["mieDirectionalG"].value = 0.95;
      // sky.material.uniforms["sunPosition"].value.set(-1, -0.02, -3);

      // Geometry
      const particlesGeometry = new THREE.BufferGeometry();
      const count = 1000;

      const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)

      for (
        let i = 0;
        i < count * 3;
        i++ // Multiply by 3 for same reason
      ) {
        positions[i] = (Math.random() - 0.5) * 10; // Math.random() - 0.5 to have a random value between -0.5 and +0.5
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      ); // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

      const particlesMaterial = new THREE.PointsMaterial();
      particlesMaterial.size = 0.03;
      particlesMaterial.sizeAttenuation = true;

      // Points
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

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

      // Cast and receive
      // directionalLight.castShadow = true;
      // ghost1.castShadow = true;
      // ghost2.castShadow = true;
      // ghost3.castShadow = true;

      // walls.castShadow = true;
      // walls.receiveShadow = true;
      // roof.castShadow = true;
      // floor.receiveShadow = true;

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

        //jumping snowman
        // snowmanGroup.position.y = Math.sin(elapsedTime * 7) * 0.5 + 0.3;
        if (snowmanObject) {
          snowmanObject.position.y = Math.sin(elapsedTime * 5) * 0.3 + 0.3;
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
        // renderer.shadowMap.enabled = true;

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
      <PageTitle title="haunted-house aka jumping snowman" />
      <canvas style={{ display: "block" }} ref={el}></canvas>
    </div>
  );
}

export default Page;
