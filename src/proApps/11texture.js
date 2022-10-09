import '../style.css'
import * as THREE from "three";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";

/**
 * Textures
 */
//loadingManager其功能是处理并跟踪已加载和待处理的数据。如果未手动设置加强管理器，则会为加载器创建和使用默认
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
    console.log('loadingManager: loading started')
}
loadingManager.onLoaded = () => {
    console.log('loadingManager: loading finished')
}
loadingManager.onProgress = () => {
    console.log('loadingManager: loading progressing')
}
loadingManager.onError = () => {
    console.log('loadingManager: loading error')
}

//TextureLoader加载texture的一个类。 内部使用ImageLoader来加载文件。
const textureLoader = new THREE.TextureLoader(loadingManager)
// const colorTexture = textureLoader.load('../static/textures/door/color.jpg')
const colorTexture = textureLoader.load('../static/textures/minecraft.png')
// const colorTexture = textureLoader.load('../static/textures/checkerboard-8x8.png')
// const colorTexture = textureLoader.load('../static/textures/checkerboard-1024x1024.png')
const alphaTexture = textureLoader.load('../static/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('../static/textures/door/height.jpg')
const normalTexture = textureLoader.load('../static/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('../static/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('../static/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('../static/textures/door/roughness.jpg')
/*
.repeat 纹理在表面上重复多少次，在每个方向 U 和 V。如果在任一方向上将重复设置为大于 1

使用RepeatWrapping，纹理将简单地重复到无穷大。 With RepeatWrapping the texture will simply repeat to infinity.
ClampToEdgeWrapping是默认值，纹理中的最后一个像素将延伸到网格的边缘。
使用MirroredRepeatWrapping， 纹理将重复到无穷大，在每次重复时将进行镜像。

.wrapS : number
这个值定义了纹理贴图在水平方向上将如何包裹，在UV映射中对应于U。
.wrapT : number
这个值定义了纹理贴图在垂直方向上将如何包裹，在UV映射中对应于V。
偏移量offset

.magFilter : number
当一个纹素覆盖大于一个像素时，贴图将如何采样。默认值为THREE.LinearFilter， 它将获取四个最接近的纹素，
并在他们之间进行双线性插值。 另一个选项是THREE.NearestFilter，它将使用最接近的纹素的值。
请参阅texture constants页面来了解详细信息。
.minFilter : number
当一个纹素覆盖小于一个像素时，贴图将如何采样。默认值为THREE.LinearMipmapLinearFilter，
它将使用mipmapping以及三次线性滤镜。

THREE.NearestFilter
THREE.LinearFilter
这些常量用于纹理的magFilter属性，它们定义了当被纹理化的像素映射到小于或者等于1纹理元素（texel）的区域时，将要使用的纹理放大函数。
NearestFilter返回与指定纹理坐标（在曼哈顿距离之内）最接近的纹理元素的值。
LinearFilter是默认值，返回距离指定的纹理坐标最近的四个纹理元素的加权平均值，
并且可以包含纹理的其他部分中，被包裹或者被重复的项目，
具体取决于 wrapS 和 wrapT 的值，and on the exact mapping。

.generateMipmaps : Boolean
是否为纹理生成mipmap（如果可用）。默认为true。 如果你手动生成mipmap，请将其设为false。
* */
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5
// colorTexture.rotation = Math.PI / 4
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5
colorTexture.generateMipmaps = false
// colorTexture.minFilter = THREE.NearestFilter //模糊
colorTexture.magFilter = THREE.NearestFilter //清楚
console.log(colorTexture)

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
    // color: parameters.color,
    map: colorTexture
    // wireframe: true //将几何体渲染为线框。默认值为false（即渲染为平面多边形）
})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)


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

function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate); //window
}

animate();
