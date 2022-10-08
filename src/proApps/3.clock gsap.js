import * as THREE from "three";
import { AxesHelper, Mesh } from "three";
import gsap from "gsap";
console.log(gsap);
const scene = new THREE.Scene();

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
mesh.position.z = 1;
scene.add(mesh);

//Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

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

//gsap
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

//二、three 提供的一个clock
// const clock = new THREE.Clock();
function animate() {
  // const elapsedTime = clock.getElapsedTime();
  // //这样可以使它转起来
  // camera.position.x = Math.sin(elapsedTime);
  // camera.position.y = Math.cos(elapsedTime);
  // camera.lookAt(mesh.position);

  renderer.render(scene, camera);
  requestAnimationFrame(animate); //window
}

// sin() 正弦值 波浪运动
// cos() 余弦值 转圈 搭配 xy
animate();
