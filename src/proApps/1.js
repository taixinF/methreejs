import * as THREE from "three";
import { AxesHelper } from "three";
const scene = new THREE.Scene();

//Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//geometryi
const geometryi = new THREE.BoxGeometry(1, 1, 1);
const materiali = new THREE.MeshBasicMaterial({ color: 0x0ff000 });
const meshi = new THREE.Mesh(geometryi, materiali);
meshi.position.set(1, 1, 1);
scene.add(meshi);
meshi.scale.set(0.7, -0.6, 1);
meshi.rotation.reorder("YXZ"); //When you rotate it
meshi.rotation.y = Math.PI / 0.55;
meshi.rotation.x = Math.PI / 0.55;
scene.add(meshi);

//geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = 1;
scene.add(mesh);
//position
//scale == set(x,y,z)
mesh.scale.set(0.7, -0.6, 1);
//rotation
mesh.rotation.reorder("YXZ"); //When you rotate it
mesh.rotation.y = Math.PI / 0.24;
mesh.rotation.x = Math.PI / 0.24;

const sizes = {
  width: 500,
  height: 500,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);
camera.lookAt(mesh.position); //可以通过new THREE.Vector3来指定位置 三维向量

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

// function animate() {
//   requestAnimationFrame(animate);
//   // mesh.rotation.x += 0.01;
//   // mesh.rotation.y += 0.01;
//   // mesh.rotation.z += 0.01;
//   renderer.render(scene, camera);
// }

// animate();
