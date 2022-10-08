import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

//canvas
const canvas = document.querySelector('.webgl')

// 手写第一种方式
//cursor
const cursor = {
    x: 0, y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
})

//scene
const scene = new THREE.Scene();
//mesh!!!!!
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
scene.add(mesh);

//Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const sizes = {
    width: 500, height: 500,
};
//camera
//PerspectiveCamera
// fov — 摄像机视锥体垂直视野角度
// aspect — 摄像机视锥体长宽比
// near — 摄像机视锥体近端面
// far — 摄像机视锥体远端面
//OrthographicCamera
// left — 摄像机视锥体左侧面。
// right — 摄像机视锥体右侧面。
// top — 摄像机视锥体上侧面。
// bottom — 摄像机视锥体下侧面。
// near — 摄像机视锥体近端面。
// far — 摄像机视锥体远端面。
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

//Controls
const controls = new OrbitControls(camera, canvas)
//阻尼效果 ~~~ 如果你使用了 阻尼效果一定要记得在每一帧空间中更新
controls.enableDamping = true
//也可以直接设置相机位置  但需要调用更新函数
// controls.target.x = 2
// controls.update()

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);
//自带创建元素方法
// document.body.appendChild(renderer.domElement);


const clock = new THREE.Clock();

function animate() {
    // mesh.rotation.y = clock.getElapsedTime();
    // 一、手写 鼠标移动动画
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * 5
    // camera.lookAt(mesh.position)


    controls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate); //window
}

// sin() 正弦值 波浪运动
// cos() 余弦值 转圈 搭配 xy
animate();
