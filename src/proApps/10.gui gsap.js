import '../style.css'
import * as THREE from "three";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import gsap from 'gsap'
import *  as  dat from 'dat.gui' ;

/*
* Debug
* */
const gui = new dat.GUI({closed:true,width:500}) //closed //收起

const parameters = {
    color: 0xfff00,
    spin: () => {
        gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + 10})
    }
}

gui.addColor(parameters, 'color')
    .onChange(() => {
        material.color.set(parameters.color)
    })

gui.add(parameters, 'spin')


/*
* Base
* */
//canvas
const canvas = document.querySelector(".webgl");

//scene
const scene = new THREE.Scene();


//Mesh!!!!!
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    color: parameters.color,
    // wireframe: true //将几何体渲染为线框。默认值为false（即渲染为平面多边形）
})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)


//Debug
//     (xxx,min,max,step)
gui.add(mesh.position, 'y', -3, 3, 0.01).name('y')
gui.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('x')
gui.add(mesh.position, 'z', -3, 3, 0.01)

gui.add(mesh, 'visible')
gui.add(mesh.material, 'wireframe')

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
const axesHelper = new THREE.AxesHelper();
gui.add(axesHelper,'visible').name('axesHelperVisible')
scene.add(axesHelper);

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
