import '../style.css'
import * as THREE from "three";

import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import {
    BoxGeometry,
    BufferAttribute
} from 'three';

//canvas
const canvas = document.querySelector(".webgl");

//scene
const scene = new THREE.Scene();


//mesh!!!!!
// width — X轴上面的宽度，默认值为1。
// height — Y轴上面的高度，默认值为1。
// depth — Z轴上面的深度，默认值为1。
// widthSegments — （可选）宽度的分段数，默认值是1。
// heightSegments — （可选）高度的分段数，默认值是1。
// depthSegments — （可选）深度的分段数，默认值是1。
//一、基础画线
// const pointsArray = new Array()
// for (let i = 0; i < 50; i++) {
//     for (let j = 0; j < 3; j++) { //三个角
//         pointsArray.push(
//             new THREE.Vector3(
//                 (Math.random() - 0.5) * 4,
//                 (Math.random() - 0.5) * 4,
//                 (Math.random() - 0.5) * 4
//             )
//         )
//     }
// }
// const geometry = new THREE.BufferGeometry().setFromPoints(pointsArray)

// 二、BufferAttribute( array : TypedArray, itemSize : Integer, normalized : Boolean )
// 这个类用于存储与BufferGeometry相关联的 attribute（例如顶点位置向量，面片索引，法向量，颜色值，
// UV坐标以及任何自定义 attribute ）。 利用 BufferAttribute， 可以更高效的向GPU传递数据。 详情和例子见该页。
// const positionsArray = new Float32Array([
//     0, 0, 0,
//     0, 1, 0,
//     1, 0, 0
// ])
// const positionsArraybute = new BufferAttribute(positionsArray, 3)
// const geometry = new THREE.BufferGeometry().setAttribute('position', positionsArraybute)

//三、
const geometry = new THREE.BufferGeometry()
const conut = 50
const positionsArray = new Float32Array(conut * 3 * 3)
console.log(positionsArray);

for (let i = 0; i < conut * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 4
}

const positionsArraybute = new BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsArraybute)


const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true //将几何体渲染为线框。默认值为false（即渲染为平面多边形）
})
const line = new THREE.Line(geometry, material);
scene.add(line)




//size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
//屏幕尺寸变化事件
window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera
    camera.aspect = sizes.width / sizes.height

    //还需要调用两个个函数
    //update camera
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    //设置设备像素比。通常用于避免HiDPI设备上绘图模糊--每次都可以用上--最小值---主要是适应更多的屏幕变化
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
//全屏
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitExitFullscreen
    if (!document.fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }

    }
})

//camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    1,
    100
);
camera.position.z = 3;
scene.add(camera);

// //Axes helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
});
renderer.setSize(sizes.width, sizes.height);

function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate); //window
}

animate();
