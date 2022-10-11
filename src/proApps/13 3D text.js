import '../style.css'
import * as THREE from "three";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import {FontLoader} from "three/addons/loaders/FontLoader";
import {TextGeometry} from "three/addons/geometries/TextGeometry";

/*
* 3D Text
* */

/*
* texture
* */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('../static/textures/matcaps/3.png')

/*
* fonts
* font — THREE.Font的实例。
size — Float。字体大小，默认值为100。
height — Float。挤出文本的厚度。默认值为50。
curveSegments — Integer。（表示文本的）曲线上点的数量。默认值为12。
bevelEnabled — Boolean。是否开启斜角，默认为false。
bevelThickness — Float。文本上斜角的深度，默认值为20。
bevelSize — Float。斜角与原始文本轮廓之间的延伸距离。默认值为8。
bevelSegments — Integer。斜角的分段数。默认值为3
*
* .boundingBox : Box3
当前 bufferGeometry 的外边界矩形。可以通过 .computeBoundingBox() 计算。默认值是 null。
.boundingSphere : Sphere
当前 bufferGeometry 的外边界球形。可以通过 .computeBoundingSphere() 计算。默认值是 null。

*
* */
const fontLoader = new FontLoader();
const font = fontLoader.load(// 资源URL
    '../static/fonts/helvetiker_regular.typeface.json', (font) => {
        console.log(font)
        const textGeometry = new TextGeometry('Hello TaiXinF', {
            font,
            size: 0.5,
            height: 0.2,
            curveSegments: 11,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 2
        });
        //一、 文字居中比较麻烦的一方法
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5,
        // )
        //二、第二种方式
        textGeometry.center()


        const material = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture
        })
        const text = new THREE.Mesh(textGeometry, material);
        scene.add(text);

        const dountGeometry = new THREE.TorusGeometry(0.32, 0.2, 20, 45);


        console.time()
        for (let i = 0; i < 1000; i++) {
            const dount = new THREE.Mesh(dountGeometry, material);
            dount.position.x = (Math.random() - 0.5) * 10
            dount.position.y = (Math.random() - 0.5) * 10
            dount.position.z = (Math.random() - 0.5) * 10

            dount.rotation.x = Math.random() * Math.PI
            dount.rotation.y = Math.random() * Math.PI
            dount.rotation.z = Math.random() * Math.PI

            const scale = Math.random()
            dount.scale.set(scale, scale, scale)
            scene.add(dount);
        }
        console.timeEnd()

    });

/*
* Base
* */
//canvas
const canvas = document.querySelector(".webgl");
//scene
const scene = new THREE.Scene();

//size
const sizes = {
    width: window.innerWidth, height: window.innerHeight,
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100);
camera.position.z = 3;
scene.add(camera);
//Axes helper
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

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate); //window
}

animate();
