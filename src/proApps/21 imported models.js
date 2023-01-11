import '../style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
//glTF（gl传输格式）是一种开放格式的规范 （open format specification），
// 用于更高效地传输、加载3D内容。该类文件以JSON（.gltf）格式或二进制（.glb）格式提供，
// 外部文件存储贴图（.jpg、.png）和额外的二进制数据（.bin）。一个glTF组件可传输一个或多个场景，
// 包括网格、材质、贴图、蒙皮、骨架、变形目标、动画、灯光以及摄像机。
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
//DRACOLoader
//要使用 Draco 压缩导出： 压缩 GL 传输格式 (*.draco.gltf) 压缩二进制 GL 传输格式 (*.draco.glb)
//使用 Draco 库压缩的几何图形加载器。
// Draco 是一个开源库，用于压缩和解压缩 3D 网格和点云。
// 压缩后的几何图形可以明显更小，代价是客户端设备上的额外解码时间。
// 独立的 Draco 文件具有 .drc 扩展名，并包含顶点位置、法线、颜色和其他属性。 Draco 文件不包含材质、纹理、动画、
// 或节点层次结构——要使用这些特性，将 Draco 几何图形嵌入到 glTF 文件中。
// 可以使用 glTF-Pipeline 将普通的 glTF 文件转换为 Draco 压缩的 glTF 文件。
// 当使用带有 glTF 的 Draco 时，GLTFLoader 将在内部使用 DRACOLoader 的实例。
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'

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
 * Models
 */
const dracoLoader = new DRACOLoader()
// .setDecoderPath ( value : String ) : this value — 包含 JS 和 WASM 解码器库的文件夹的路径。
dracoLoader.setDecoderPath('../static/draco')  //找个文件在three。js源码内部可以找到 node_modules\three\examples\js\libs\draco

const gltfLoader = new GLTFLoader()
//.setDRACOLoader ( dracoLoader : DRACOLoader ) : this
// dracoLoader — THREE.DRACOLoader的实例，用于解码使用KHR_draco_mesh_compression扩展压缩过的文件。
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load(
    '../static/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        //scene在这里原本就是一个group
        console.log(gltf)
        gltf.scene.scale.set(0.025, 0.025, 0.025)
        //第一种加载方式
        // const children = [...gltf.scene.children]
        // for (const child of children) {
        //     scene.add(child)
        // }
        //第二种加载方式
        scene.add(gltf.scene)
        // Animation
        //AnimationMixer
        // 动画混合器是用于场景中特定对象的动画的播放器。当场景中的多个对象独立动画时，每个对象都可以使用同一个动画混合器。
        // 在使用手册的“下一步”章节中，“动画系统”一文对three.js动画系统中的不同元素作出了概述
        //AnimationMixer( rootObject : Object3D )
        // rootObject - 混合器播放的动画所属的对象
        mixer = new THREE.AnimationMixer(gltf.scene)
        console.log(mixer)
        //.clipAction (clip : AnimationClip, optionalRoot : Object3D) : AnimationAction
        // 返回所传入的剪辑参数的AnimationAction, 根对象参数可选，默认值为混合器的默认根对象。
        // 第一个参数可以是动画剪辑(AnimationClip)对象或者动画剪辑的名称。
        const action = mixer.clipAction(gltf.animations[2])
        //.play () : this
        // 让混合器激活动作。此方法可链式调用。
        action.play()
    }
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(-5, 5, 0)
scene.add(directionalLight)

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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
    if (mixer) {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
