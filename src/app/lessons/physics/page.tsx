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
import CANNON from "cannon";

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
       * Lights
       */
      const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.set(1024, 1024);
      directionalLight.shadow.camera.far = 15;
      directionalLight.shadow.camera.left = -7;
      directionalLight.shadow.camera.top = 7;
      directionalLight.shadow.camera.right = 7;
      directionalLight.shadow.camera.bottom = -7;
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      /**
       * Physics
       */
      const world = new CANNON.World();
      world.gravity.set(0, -9.82, 0);

      const concreteMaterial = new CANNON.Material("concrete");
      const plasticMaterial = new CANNON.Material("plastic");

      // //두 물체가 만났을 때의 반발, 마찰 설정
      // const concretePlasticContactMaterial = new CANNON.ContactMaterial(
      //   concreteMaterial,
      //   plasticMaterial,
      //   {
      //     friction: 0.1,
      //     restitution: 0.7,
      //   }
      // );
      // world.addContactMaterial(concretePlasticContactMaterial);

      const defaultMaterial = new CANNON.Material("default");
      const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
          friction: 0.1,
          restitution: 0.7,
        }
      );
      world.addContactMaterial(defaultContactMaterial);

      world.defaultContactMaterial = defaultContactMaterial;

      // const sphereShape = new CANNON.Sphere(0.5);

      // const sphereBody = new CANNON.Body({
      //   mass: 1,
      //   position: new CANNON.Vec3(0, 3, 0),
      //   shape: sphereShape,
      //   // material: plasticMaterial
      //   // material: defaultMaterial,
      // });

      // // sphereBody.applyLocalForce(
      // //   new CANNON.Vec3(100, 0, 0),
      // //   new CANNON.Vec3(0, 0, 0)
      // // );

      // world.addBody(sphereBody);

      const floorShape = new CANNON.Plane();
      const floorBody = new CANNON.Body();
      // floorBody.material = concreteMaterial;
      // floorBody.material = defaultMaterial;

      floorBody.mass = 0;
      floorBody.addShape(floorShape);

      //기본값이 세워져 있어서 눕혀줌
      floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(-1, 0, 0),
        Math.PI * 0.5
      );

      world.addBody(floorBody);

      const material = new THREE.MeshStandardMaterial({});

      /**
       * Textures
       */
      const textureLoader = new THREE.TextureLoader();

      const cubeTextureLoader = new THREE.CubeTextureLoader();

      const environmentMapTexture = cubeTextureLoader.load([
        new URL("./textures/environmentMaps/0/px.png", import.meta.url).href,
        new URL("./textures/environmentMaps/0/nx.png", import.meta.url).href,
        new URL("./textures/environmentMaps/0/py.png", import.meta.url).href,
        new URL("./textures/environmentMaps/0/ny.png", import.meta.url).href,
        new URL("./textures/environmentMaps/0/pz.png", import.meta.url).href,
        new URL("./textures/environmentMaps/0/nz.png", import.meta.url).href,
      ]);

      /**
       * Sounds
       */
      const hitSound = new Audio(
        new URL("./sounds/hit.mp3", import.meta.url).href
      );

      const playHitSound = (collision: any) => {
        const impactStrength = collision.contact.getImpactVelocityAlongNormal();

        if (impactStrength > 1.5) {
          hitSound.volume = Math.random();
          hitSound.currentTime = 0;
          hitSound.play();
        }
      };

      /**
       * Test sphere
       */
      // const sphere = new THREE.Mesh(
      //   new THREE.SphereGeometry(0.5, 32, 32),
      //   new THREE.MeshStandardMaterial({
      //     metalness: 0.3,
      //     roughness: 0.4,
      //     envMap: environmentMapTexture,
      //     envMapIntensity: 0.5,
      //   })
      // );
      // sphere.castShadow = true;
      // sphere.position.y = 0.5;
      // scene.add(sphere);

      //지오메트리랑 머테리얼을 createSphere할 때 매번 할 필요없어서 밖으로 빼서 최적화
      const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
      });

      const createSphere = (radius: any, position: any) => {
        // // Three.js mesh
        // const mesh = new THREE.Mesh(
        //   new THREE.SphereGeometry(radius, 20, 20),
        //   new THREE.MeshStandardMaterial({
        //     metalness: 0.3,
        //     roughness: 0.4,
        //     envMap: environmentMapTexture,
        //     envMapIntensity: 0.5,
        //   })
        // );
        const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        mesh.castShadow = true;
        mesh.scale.set(radius, radius, radius);
        mesh.position.copy(position);
        scene.add(mesh);

        // Cannon.js body
        const shape = new CANNON.Sphere(radius);

        const body = new CANNON.Body({
          mass: 1,
          position: new CANNON.Vec3(0, 3, 0),
          shape: shape,
          material: defaultMaterial,
        });
        body.position.copy(position);

        body.addEventListener("collide", playHitSound);

        world.addBody(body);

        objectsToUpdate.push({
          mesh,
          body,
        });
      };

      createSphere(0.5, { x: 0, y: 3, z: 0 });

      //@ts-ignore
      debugObject.createSphere = () => {
        // createSphere(0.5, { x: 0, y: 3, z: 0 });
        createSphere(Math.random() * 0.5, {
          x: (Math.random() - 0.5) * 3,
          y: 3,
          z: (Math.random() - 0.5) * 3,
        });
      };

      gui.add(debugObject, "createSphere");

      // Create box
      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const boxMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
      });

      //@ts-ignore
      const createBox = (width, height, depth, position) => {
        // Three.js mesh
        const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
        mesh.scale.set(width, height, depth);
        mesh.castShadow = true;
        mesh.position.copy(position);
        scene.add(mesh);

        // Cannon.js body
        const shape = new CANNON.Box(
          new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
        );

        const body = new CANNON.Body({
          mass: 1,
          position: new CANNON.Vec3(0, 3, 0),
          shape: shape,
          material: defaultMaterial,
        });
        body.position.copy(position);

        body.addEventListener("collide", playHitSound);

        world.addBody(body);

        // Save in objects
        objectsToUpdate.push({ mesh, body });
      };

      createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 });

      //@ts-ignore
      debugObject.createBox = () => {
        createBox(Math.random(), Math.random(), Math.random(), {
          x: (Math.random() - 0.5) * 3,
          y: 3,
          z: (Math.random() - 0.5) * 3,
        });
      };

      gui.add(debugObject, "createBox");


      //reset
      //@ts-ignore
      debugObject.reset = () => {
        for (const object of objectsToUpdate) {
          // Remove body
          object.body.removeEventListener("collide", playHitSound);
          //@ts-ignore
          world.removeBody(object.body);

          // Remove mesh
          scene.remove(object.mesh);
        }
      };

      gui.add(debugObject, "reset");

      /**
       * Floor
       */
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
          color: "#777777",
          metalness: 0.3,
          roughness: 0.4,
          envMap: environmentMapTexture,
          envMapIntensity: 0.5,
        })
      );
      floor.receiveShadow = true;
      floor.rotation.x = -Math.PI * 0.5;
      scene.add(floor);

      //최적화
      world.broadphase = new CANNON.SAPBroadphase(world);
      world.allowSleep = true;

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
      camera.position.set(-3, 3, 3);
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

        // Update controls
        controls.update();

        for (const object of objectsToUpdate) {
          object.mesh.position.copy(object.body.position);
        }

        //박스
        for (const object of objectsToUpdate) {
          object.mesh.position.copy(object.body.position);
          object.mesh.quaternion.copy(object.body.quaternion);
        }

        // Update physics
        // sphereBody.applyForce(new CANNON.Vec3(- 0.5, 0, 0), sphereBody.position);

        // Update physics 60프레임 , deltaTIme으로 지난 시간을 알려줌
        // (method) globalThis.CANNON.World.step(dy: number, timeSinceLastCalled?: number, maxSubSteps?: number): void
        world.step(1 / 60, deltaTime, 3);
        // console.log(sphereBody.position.y); //떨어지고는 있음
        //threejs mesh에 cannon에 연동을 해줘야함
        // sphere.position.x = sphereBody.position.x;
        // sphere.position.y = sphereBody.position.y;
        // sphere.position.z = sphereBody.position.z;
        // or
        // sphere.position.copy(sphereBody.position);

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
      <PageTitle title="physics" />
      <canvas style={{ display: "block" }} ref={el}></canvas>
    </div>
  );
}

export default Page;
