"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import HomeButton from "../../components/HomeButton";
import PageTitle from "../../components/PageTitle";
import styles from "../../page.module.css";

function Page() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!el.current) {
      return;
    }
    el.current.innerHTML = "";

    const scene = new THREE.Scene();

    const sizes = {
      WIDTH: window.innerWidth,
      HEIGHT: window.innerHeight,
    };
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.WIDTH / sizes.HEIGHT,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(sizes.WIDTH, sizes.HEIGHT);
    el.current.appendChild(renderer.domElement);

    /**add group on the scene */
    const group = new THREE.Group();
    /** transform cubes by group  */
    group.scale.y = 1.4;
    group.rotation.y = 0.5;


    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ffee });
    const cube1 = new THREE.Mesh(geometry, material1);
    cube1.position.x = -1.5;

    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    cube1.applyQuaternion(quaternion);

    scene.add(group);

    /**add cube1 on the group */
    group.add(cube1);

    const material2 = new THREE.MeshBasicMaterial({ color: 0xffeeee });
    const cube2 = new THREE.Mesh(geometry, material2);
    cube2.position.x = 0;
    /** transform cube2 individually */
    cube2.scale.y = 0.7;
    cube2.rotation.y = 0.5;
    /**add cube2 on the group */
    group.add(cube2);

    const material3 = new THREE.MeshBasicMaterial({ color: 0xee00ff });
    const cube3 = new THREE.Mesh(geometry, material3);
    cube3.position.x = 1.5;
    /**add cube3 on the group */
    group.add(cube3);

    const axedHelper = new THREE.AxesHelper();
    scene.add(axedHelper);

    camera.position.z = 5;
    camera.position.y = 1;
    camera.position.x = 1;
    /**transform the facing direction */
    camera.lookAt(new THREE.Vector3(-0.5, 0.5, 0));

    renderer.render(scene, camera);
  }, []);
  return (
    <div className={styles.page}>
      <HomeButton />
      <PageTitle title="transform" />
      <div ref={el}></div>
    </div>
  );
}

export default Page;
