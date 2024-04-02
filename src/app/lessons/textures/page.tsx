"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "../../page.module.css";
import HomeButton from "@/app/components/HomeButton";
import PageTitle from "@/app/components/PageTitle";

function Page() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }
    el.current.innerHTML = "";

    //Solution1.
    // const image = new Image();
    // const texture = new THREE.Texture(image);
    // texture.colorSpace = THREE.SRGBColorSpace;

    // image.onload = () => {
    //   texture.needsUpdate = true;
    // };

    // image.src = "../textures/door/color.jpg";

    //Solution2.
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onStart = () => {
      console.log("onLoaded");
    };
    loadingManager.onProgress = () => {
      console.log("onProgress");
    };
    loadingManager.onError = () => {
      console.log("onError");
    };
    const textureLoader = new THREE.TextureLoader(loadingManager);

    const src = new URL("./textures/checkerboard-8x8.png", import.meta.url);

    const texture = textureLoader.load(
      src.pathname
      // () => {
      //   console.log("textureLoader: loading finished");
      // },
      // () => {
      //   console.log("textureLoader: loading progressing");
      // },
      // () => {
      //   console.log("textureLoader: loading error");
      // }
    );
    texture.colorSpace = THREE.SRGBColorSpace;

    const src2 = new URL(
      "./textures/checkerboard-1024x1024.png",
      import.meta.url
    );

    const texture2 = textureLoader.load(
      src2.pathname
      // () => {
      //   console.log("textureLoader: loading finished");
      // },
      // () => {
      //   console.log("textureLoader: loading progressing");
      // },
      // () => {
      //   console.log("textureLoader: loading error");
      // }
    );

    // texture.repeat.x = 2;
    // texture.repeat.y = 2;
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;

    // texture.offset.x = 0.5;
    // texture.offset.y = 0.5;

    //회전 기준점을 중심으로 이동
    // texture.center.x = 0.5;
    // texture.center.y = 0.5;

    // texture.rotation = Math.PI / 4;

    texture.generateMipmaps = false; //deactivate it when using NearestFilter
    // texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    const cursor = {
      X: 0,
      Y: 0,
    };

    el.current?.addEventListener("mousemove", (e) => {
      cursor.X = e.clientX / window.innerWidth - 0.5;

      cursor.Y = -(e.clientY / window.innerHeight - 0.5);
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      //field of view
      75,
      //aspect ratio
      window.innerWidth / window.innerHeight,
      //near
      0.1,
      //far
      100
    );

    const controls = new OrbitControls(camera, el.current);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
    // console.log(geometry.attributes.uv)

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);

    const material2 = new THREE.MeshBasicMaterial({ map: texture2 });
    const cube2 = new THREE.Mesh(geometry, material);
    cube.position.y = 1.5;
    scene.add(cube);
    // scene.add(cube2);

    const axedHelper = new THREE.AxesHelper();
    scene.add(axedHelper);

    camera.position.z = 3;
    camera.lookAt(cube.position);
    camera.lookAt(cube2.position);

    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.0005;
      cube2.rotation.x += 0.0005;

      /**update controls for smooth damping  */
      controls.update();

      renderer.render(scene, camera);
    }

    animate();
  }, []);

  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="textures" />
      <div style={{ display: "block" }} ref={el}></div>
    </div>
  );
}

export default Page;
