"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../../page.module.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

      let model: any = null;
      gltfLoader.load(
        "/static/models/borbemporium_cat/scene.gltf",
        (gltf) => {
          // console.log("success");
          // console.log(gltf);

          model = gltf.scene.children[0];
          model.scale.set(40, 40, 40);
          model.position.y = -1.2;
          scene.add(model);
        },
        (progress) => {
          console.log("progress");
          // console.log(progress);
        },
        (error) => {
          console.log("error");
          console.log(error);
        }
      );

      /**
       * Lights
       */
      // Ambient light
      const ambientLight = new THREE.AmbientLight("#ffffff", 0.9);
      scene.add(ambientLight);

      // Directional light
      const directionalLight = new THREE.DirectionalLight("#ffffff", 2.1);
      directionalLight.position.set(1, 2, 3);
      scene.add(directionalLight);

      /**
       * Objects
       */
      const object1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: "#ff0000" })
      );
      object1.position.x = -2;

      const object2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: "#0aff12" })
      );

      const object3 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: "#ffb300" })
      );
      object3.position.x = 2;

      scene.add(object1, object2, object3);

      /**
       * Raycaster
       */
      const raycaster = new THREE.Raycaster();

      // 원점
      const rayOrigin = new THREE.Vector3(-3, 0, 0);
      // 방향
      const rayDirection = new THREE.Vector3(10, 0, 0);
      rayDirection.normalize();

      raycaster.set(rayOrigin, rayDirection);

      /**
       * Mouse
       */
      const mouse = new THREE.Vector2();

      let currentIntersect = null;

      // window.addEventListener("click", () => {
      //   if (currentIntersect) {
      //     switch (currentIntersect.object) {
      //       case object1:
      //         console.log("click on object 1");
      //         break;

      //       case object2:
      //         console.log("click on object 2");
      //         break;

      //       case object3:
      //         console.log("click on object 3");
      //         break;
      //     }
      //   }
      // });

      window.addEventListener("mousemove", (event) => {
        // 마우스 좌표를 캔버스 좌표로 변환
        mouse.x = (event.clientX / sizes.width) * 2 - 1;
        mouse.y = -(event.clientY / sizes.height) * 2 + 1;

        // console.log(mouse);
      });

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
      camera.position.z = 3;
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
      renderer.setClearColor("#006aff");

      /**
       * Animate
       */
      const clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // // Animate objects
        // object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
        // object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
        // object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

        // // Cast a ray
        // const rayOrigin = new THREE.Vector3(-3, 0, 0);
        // const rayDirection = new THREE.Vector3(1, 0, 0);
        // // 방향 정규화
        // rayDirection.normalize();

        // raycaster.set(rayOrigin, rayDirection);

        // const objectsToTest = [object1, object2, object3];
        // const intersects = raycaster.intersectObjects(objectsToTest);
        // // console.log(intersects);

        // for (const object of objectsToTest) {
        //   object.material.color.set("#ff0000");
        // }

        // for (const intersect of intersects) {
        //   intersect.object.material.color.set("#0000ff");
        // }

        raycaster.setFromCamera(mouse, camera);

        const objectsToTest = [object1, object2, object3];
        const intersects = raycaster.intersectObjects(objectsToTest);

        // for (const intersect of intersects) {
        //   intersect.object.material.color.set("#0000ff");
        // }

        // for (const object of objectsToTest) {
        //   if (!intersects.find((intersect) => intersect.object === object)) {
        //     object.material.color.set("#ff0000");
        //   }
        // }

        // if (intersects.length) {
        //   if (!currentIntersect) {
        //     // console.log("mouse enter");
        //   }

        //   currentIntersect = intersects[0];
        // } else {
        //   if (currentIntersect) {
        //     // console.log("mouse leave");
        //   }

        //   currentIntersect = null;
        // }

        // Test intersect with a model
        if (model) {
          const modelIntersects = raycaster.intersectObject(model);
          // console.log(modelIntersects);

          if (modelIntersects.length) {
            model.scale.set(80, 80, 80);
            model.rotation.y = Math.PI / 6;
          } else {
            model.scale.set(40, 40, 40);
            model.rotation.y = 0;
          }
        }

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
      {/* <HomeButton />
      <PageTitle title="raycaster-and-mouse-events" /> */}
      <canvas style={{ display: "block" }} ref={el}></canvas>
    </div>
  );
}

export default Page;
