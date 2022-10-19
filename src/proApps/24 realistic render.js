import '../style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()


/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Update all materials
 */
const updateAllMaterials = () => {
    //.traverse ( callback : Function ) : undefined
    // callback - 以一个object3D对象作为第一个参数的函数。
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '../static/textures/environmentMaps/2/px.jpg',
    '../static/textures/environmentMaps/2/nx.jpg',
    '../static/textures/environmentMaps/2/py.jpg',
    '../static/textures/environmentMaps/2/ny.jpg',
    '../static/textures/environmentMaps/2/pz.jpg',
    '../static/textures/environmentMaps/2/nz.jpg'
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 5
// gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(() => {
    updateAllMaterials()
})


/**
 * Models
 */
gltfLoader.load(
    '../static/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10)
        gltf.scene.position.set(0, -4, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')

        updateAllMaterials()
    }
)


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, -2.25)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')


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
camera.position.set(4, 1, -4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    //antialias - 是否执行抗锯齿。默认为false. //构造器上的
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//.physicallyCorrectLights : Boolean
// 是否使用物理上正确的光照模式。 默认是false。 示例：lights / physical
renderer.physicallyCorrectLights = true
//.outputEncoding : number
// 定义渲染器的输出编码。默认为THREE.LinearEncoding
// 如果渲染目标已经使用 .setRenderTarget、之后将直接使用renderTarget.texture.encoding
// 查看texture constants页面以获取其他格式细节
//让3d图光线真实必备
renderer.outputEncoding = THREE.sRGBEncoding
//.toneMapping : Constant
// 默认是NoToneMapping。查看Renderer constants以获取其它备选项
//色调映射
// THREE.NoToneMapping
// THREE.LinearToneMapping
// THREE.ReinhardToneMapping
// THREE.CineonToneMapping
// THREE.ACESFilmicToneMapping
// 这些常量定义了WebGLRenderer中toneMapping的属性。
// 这个属性用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果。
renderer.toneMapping = THREE.ReinhardToneMapping
//.toneMappingExposure : Number
// 色调映射的曝光级别。默认是1
renderer.toneMappingExposure = 3
//.shadowMap : WebGLShadowMap
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui
    .add(renderer, 'toneMapping', {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping
    })
    .onFinishChange(() => {
        renderer.toneMapping = Number(renderer.toneMapping)
        updateAllMaterials()
    })
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)


/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
