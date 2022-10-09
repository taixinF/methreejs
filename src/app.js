import './style.css'
import * as THREE from "three";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";


/*
* Base
* */
//canvas
const canvas = document.querySelector(".webgl");

//scene
const scene = new THREE.Scene();

/*
* Texture
* */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('../static/textures/door/color.jpg')
const doorCAlphaTexture = textureLoader.load('../static/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('../static/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('../static/textures/door/normal.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('../static/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture = textureLoader.load('../static/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('../static/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('../static/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('../static/textures/gradients/3.jpg')


/*
Objects
 */
const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture
/*
*.set ( value : Color_Hex_or_String ) : this      ---是一个类
value - 用于设置该颜色的值。
* new THREE.Color()//设置颜色
* */
material.color = new THREE.Color('red')

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)
sphere.position.x = -1.5
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    material
)
plane.position.x = 1.5
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
)
scene.add(sphere, plane, torus)


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
    0.1,
    100
);
camera.position.z = 3;
scene.add(camera);

// //Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
});
renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock()

function animate() {
    const elapsedTime = clock.getElapsedTime()

    //Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.1 * elapsedTime
    plane.rotation.x = 0.1 * elapsedTime
    torus.rotation.x = 0.1 * elapsedTime

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate); //window
}

animate();
