import * as THREE from "three";
import { AxesHelper, log, Mesh } from "three";
const scene = new THREE.Scene();
//Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//group
const group = new THREE.Group();
scene.add(group);
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
group.add(cube1);
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube2.position.x = -2;
group.add(cube2);
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0x0ff000 })
);
cube3.position.x = 2;
group.add(cube3);

const sizes = {
  width: 500,
  height: 500,
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

// 一、let time = Date.now();
//这样保持在所有点网站上都保持同样的速度
// const currentTime = Date.now();
// const deltaTime = currentTime - time;
// time = currentTime;

//二、three 提供的一个clock
const clock = new THREE.Clock();
function animate() {
  const elapsedTime = clock.getElapsedTime();

  camera.position.x = Math.sin(elapsedTime);
  camera.position.y = Math.cos(elapsedTime);

  renderer.render(scene, camera);
  requestAnimationFrame(animate); //window
}

// sin() 正弦值 波浪运动
// cos() 余弦值 转圈 搭配 xy
animate();
