import './style.css'
import * as THREE from "three";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";

//canvas
const canvas = document.querySelector(".webgl");

//scene
const scene = new THREE.Scene();



//mesh!!!!!
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0xff0000
    })
);
scene.add(mesh);

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
    1000
);
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

//Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//Controls
const controls = new OrbitControls(camera, canvas);
// controls.enabled = false
//阻尼效果 ~~~ 如果你使用了 阻尼效果一定要记得在每一帧空间中更新
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