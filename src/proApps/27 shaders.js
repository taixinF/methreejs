import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
// .glsl是着色器语法，并不需要去解析它，只要将它的内容作为字符串传给threejs，threejs自然会调用相关方法去解析它。
// 所以，在导入时，告诉vite，以字符串形式加载.glsl文件即可，即在文件后面加上“raw”参数即可：
import testVertexShader from './shaders/test/vertex.glsl?raw'
import testFragmentShader from './shaders/test/fragment.glsl?raw'
import {max} from "three/nodes";

/*
* learn what is shader
* create our own simple shader
* Learn the syntax
* do some exercises(练习题)
* */
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('../static/textures/nationalFlag/flag-french.jpg')
const flagTextures = textureLoader.load('../static/textures/nationalFlag/chinaFlag.png')
/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)


console.log(geometry)
//uv 就是纹理坐标 在几何中该如何放置纹理
// Material (Raw:原始的)
// 原始着色器材质(RawShaderMaterial)
// 此类的工作方式与ShaderMaterial类似，不同之处在于内置的 >uniforms< 和 >attributes< 的定义不会自动添加到GLSL shader代码中。
//如果使用ShaderMaterial
// 内置attributes和uniforms与 代码一起传递到shaders。
// 如果您不希望WebGLProgram向shader代码添加任何内容，则可以使用RawShaderMaterial而不是此类。
const material = new THREE.ShaderMaterial({
    // projectionMatrix(投影矩阵) viewMatrix(视图矩阵) modelMatrix(模型矩阵)
    vertexShader: testVertexShader,//'顶点着色器'
    fragmentShader: testFragmentShader, //'片段着色器'
    // wireframe: true
    side: THREE.DoubleSide, //这里声明的变量可以在glsl 中使用到
    uniforms: {
        uFrequency: {value: new THREE.Vector2(10, 5)},
        uTime: {value: 0},
        uColor: {value: new THREE.Color('purple')},
        uTexture: {value: flagTextures}
    }
})
console.log(material)

gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('uFrequencyX')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('uFrequencyY')

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2 / 3
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth, height: window.innerHeight
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
camera.position.set(0.25, -0.25, 1)
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
