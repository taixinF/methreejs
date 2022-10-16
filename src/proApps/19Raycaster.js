import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

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
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

//光线投射Raycaster
// 这个类用于进行raycasting（光线投射）。 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。
// Raycaster( origin : Vector3, direction : Vector3, near : Float, far : Float )
// origin —— 光线投射的原点向量。
// direction —— 向射线提供方向的方向向量，应当被标准化。
// near —— 返回的所有结果比near远。near不能为负值，其默认值为0。
// far —— 返回的所有结果都比far近。far不能小于near，其默认值为Infinity（正无穷。）
// 这将创建一个新的raycaster对象。
// .set ( origin : Vector3, direction : Vector3 ) : undefined
// origin —— 光线投射的原点向量。
// direction —— 为光线提供方向的标准化方向向量。
// 使用一个新的原点和方向来更新射线。
// .normalize () : this
// 将该向量转换为单位向量（unit vector）， 也就是说，将该向量的方向设置为和原向量相同，但是其长度（length）为1。
// distance —— 射线投射原点和相交部分之间的距离。
// point —— 相交部分的点（世界坐标）
// face —— 相交的面
// faceIndex —— 相交的面的索引
// object —— 相交的物体
// uv —— 相交部分的点的UV坐标。
// uv2 —— Second set of U,V coordinates at point of intersection
// instanceId – The index number of the instance where the ray intersects the InstancedMesh
// 当计算这条射线是否和物体相交的时候，Raycaster将传入的对象委托给raycast方法。 这将可以让mesh对于光线投射的响应不同于lines和pointclouds。
// 请注意：对于网格来说，面必须朝向射线的原点，以便其能够被检测到。
// 用于交互的射线穿过面的背侧时，将不会被检测到。如果需要对物体中面的两侧进行光线投射， 你需要将material中的side属性设置为THREE.DoubleSide。
const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);

// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);
// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);

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
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

window.addEventListener("click", () => {
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case object1:
        console.log("click on object 1");
        break;

      case object2:
        console.log("click on object 2");
        break;

      case object3:
        console.log("click on object 3");
        break;
    }
  }
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

/**
 * Animate
 */
const clock = new THREE.Clock();
let currentIntersect = null;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  ////Aanimate objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  //.setFromCamera ( coords : Vector2, camera : Camera ) : undefined
  // coords —— 在标准化设备坐标中鼠标的二维坐标 —— X分量与Y分量应当在-1到1之间。
  // camera —— 射线所来源的摄像机。
  // 使用一个新的原点和方向来更新射线。
  //   / Cast a ray from the mouse
  raycaster.setFromCamera(mouse, camera);
  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);
  for (const object of objectsToTest) {
    object.material.color.set("#ff0000");
  }
  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
  }

  if (intersects.length) {
    if (!currentIntersect) {
      console.log("mouse enter");
    }
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      console.log("mouse leave");
    }
    currentIntersect = null;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
