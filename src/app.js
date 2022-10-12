import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/*
* texture
* */
const textureLoader = new THREE.TextureLoader()
const backedShadow = textureLoader.load('../static/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('../static/textures/simpleShadow.jpg')


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)
ambientLight.castShadow = false

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, -1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(directionalLight)
// .castShadow : Boolean
// 如果设置为 true 该平行光会产生动态阴影。 警告: 这样做的代价比较高而且需要一直调整到阴影看起来正确.
// 查看 DirectionalLightShadow 了解详细信息。该属性默认为 false。
directionalLight.castShadow = false
//     .shadow : DirectionalLightShadow
// 这个 DirectionalLightShadow 对象用来计算该平行光产生的阴影。
//     .mapSize : Vector2
// 一个Vector2定义阴影贴图的宽度和高度。
directionalLight.shadow.mapSize.x = 1024
directionalLight.shadow.mapSize.y = 1024
directionalLight.shadow.camera.near = 2
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.far = 6
// .radius : Float
// 将此值设置为大于1的值将模糊阴影的边缘。
// 较高的值会在阴影中产生不必要的条带效果 - 更大的mapSize将允许在这些效果变得可见之前使用更高的值。
// 请注意，如果[page：WebGLRenderer.shadowMap.type]设置为BasicShadowMap，将会无效。
// directionalLight.shadow.radius = 10

//SpotLight
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3)
spotLight.position.set(0, 2, 2)
spotLight.castShadow = false
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30 //聚光宽度
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6
scene.add(spotLight)
scene.add(spotLight.target)
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

//pointLight
const pointLight = new THREE.PointLight(0xffffff, 0.4)
pointLight.castShadow = false
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.hieght = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 6
pointLight.position.set(-1, 1, 0)
scene.add(pointLight)
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)


// CameraHelper
// 构造函数
// CameraHelper( camera : Camera )
// camera -- 被模拟的相机.
//     为指定相机创建一个新的相机辅助对象 CameraHelper .
//     属性
// 请到基类 LineSegments 页面查看公共属性.
//     .camera : Camera
// 被模拟的相机.
//     .pointMap : Object
// 包含用于模拟相机的点.
//     .matrix : Object
// 请参考相机的世界矩阵 camera.matrixWorld.
//     .matrixAutoUpdate : Object
// 请查看 Object3D.matrixAutoUpdate. 这里设置为 false 表示辅助对象 使用相机的 matrixWorld.
const directionLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionLightCameraHelper.visible = false
scene.add(directionLightCameraHelper)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

//.castShadow : Boolean
// 对象是否被渲染到阴影贴图中。默认值为false。
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5

//.receiveShadow : Boolean
// 材质是否接收阴影。默认值为false。
plane.receiveShadow = true

scene.add(sphere, plane)


const sphereShaow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShaow.rotation.x = -Math.PI * 0.5
sphereShaow.position.y = plane.position.y + 0.01
scene.add(sphereShaow)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer .shadowMap : WebGLShadowMap
// 如果使用，它包含阴影贴图的引用。
// - enabled: 如果设置开启，允许在场景中使用阴影贴图。默认是 false。
// - autoUpdate: 启用场景中的阴影自动更新。默认是true
// 如果不需要动态光照/阴影, 则可以在实例化渲染器时将之设为false
// - needsUpdate: 当被设为true, 场景中的阴影贴图会在下次render调用时刷新。默认是false
// 如果你已经禁用了阴影贴图的自动更新(shadowMap.autoUpdate = false), 那么想要在下一次渲染时更新阴影的话就需要将此值设为true
// - type: 定义阴影贴图类型 (未过滤, 关闭部分过滤, 关闭部分双线性过滤), 可选值有:
// THREE.BasicShadowMap
// THREE.PCFShadowMap (默认)
// THREE.PCFSoftShadowMap
// THREE.VSMShadowMap
// 详见Renderer constants
renderer.shadowMap.enabled = false
// 阴影类型
// THREE.BasicShadowMap
// THREE.PCFShadowMap
// THREE.PCFSoftShadowMap
// THREE.VSMShadowMap
// 这些常量定义了WebGLRenderer中shadowMap.type的属性。
// BasicShadowMap 能够给出没有经过过滤的阴影映射 —— 速度最快，但质量最差。
// PCFShadowMap 为默认值，使用Percentage-Closer Filtering (PCF)算法来过滤阴影映射。
// PCFSoftShadowMap 和PCFShadowMap一样使用 Percentage-Closer Filtering (PCF) 算法过滤阴影映射，但在使用低分辨率阴影图时具有更好的软阴影。
// VSMShadowMap 使用Variance Shadow Map (VSM)算法来过滤阴影映射。当使用VSMShadowMap时，所有阴影接收者也将会投射阴影。
renderer.shadowMap.type = THREE.PCFSoftShadowMap


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    sphere.position.x = Math.cos(elapsedTime)
    sphere.position.z = Math.sin(elapsedTime)
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    sphereShaow.position.x = sphere.position.x
    sphereShaow.position.z = sphere.position.z
    sphereShaow.material.opacity = (1 - Math.abs(sphere.position.y)) * 0.3

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()