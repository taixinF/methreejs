import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// 平行光（DirectionalLight）
// 平行光是沿着特定方向发射的光。这种光的表现像是无限远,从它发出的光线都是平行的。
// 常常用平行光来模拟太阳光 的效果; 太阳足够远，因此我们可以认为太阳的位置是无限远，所以我们认为从太阳发出的光线也都是平行的。
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight);

//半球光（HemisphereLight）
// 光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
// 半球光不能投射阴影。
// HemisphereLight( skyColor : Integer, groundColor : Integer, intensity : Float )
// skyColor - (可选参数) 天空中发出光线的颜色。 缺省值 0xffffff。
// groundColor - (可选参数) 地面发出光线的颜色。 缺省值 0xffffff。
// intensity - (可选参数) 光照强度。 缺省值 1。
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

// 点光源（PointLight）
// 从一个点向各个方向发射的光源。一个常见的例子是模拟一个灯泡发出的光。
// PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
// color - (可选参数)) 十六进制光照颜色。 缺省值 0xffffff (白色)。
// intensity - (可选参数) 光照强度。 缺省值 1。
// distance - 这个距离表示从光源到光照强度为0的位置。 当设置为0时，光永远不会消失(距离无穷大)。缺省值 0.
// decay - 沿着光照距离的衰退量。缺省值 1。 在 physically correct 模式中，decay = 2。
const pointLight = new THREE.PointLight(0xffffff, 0.5, 10, 2)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

// 平面光光源（RectAreaLight）
// 平面光光源从一个矩形平面上均匀地发射光线。这种光源可以用来模拟像明亮的窗户或者条状灯光光源。
// RectAreaLight( color : Integer, intensity : Float, width : Float, height : Float )
// color - (可选参数) 十六进制数字表示的光照颜色。缺省值为 0xffffff (白色)
// intensity - (可选参数) 光源强度／亮度 。缺省值为 1。
// width - (可选参数) 光源宽度。缺省值为 10。
// height - (可选参数) 光源高度。缺省值为 10。
//搭配MeshPhongMaterial 材质使用效果更佳
// Phong网格材质(MeshPhongMaterial)
// 一种用于具有镜面高光的光泽表面的材质。
// 该材质使用非物理的Blinn-Phong模型来计算反射率。
// 与MeshLambertMaterial中使用的Lambertian模型不同，
// 该材质可以模拟具有镜面高光的光泽表面（例如涂漆木材）。MeshPhongMaterial uses per-fragmet shading。
const rectLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectLight.position.set(-1.5, 0, 1.5)
rectLight.lookAt(new THREE.Vector3())
scene.add((rectLight))

// 聚光灯（SpotLight）
// 光线从一个点沿一个方向射出，随着光线照射的变远，光线圆锥体的尺寸也逐渐增大。
// 构造器（Constructor）
// SpotLight( color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float )
// color - (可选参数) 十六进制光照颜色。 缺省值 0xffffff (白色)。
// intensity - (可选参数) 光照强度。 缺省值 1。
// distance - 从光源发出光的最大距离，其强度根据光源的距离线性衰减。
// angle - 光线散射角度，最大为Math.PI/2。
// penumbra - 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
// decay - 沿着光照距离的衰减量。
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
//光范围
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
// 光源移动
spotLight.target.position.x = -0.75
scene.add(spotLight.target)


//helpers
// HemisphereLightHelper
// 创建一个虚拟的球形网格 Mesh 的辅助对象来模拟 半球形光源 HemisphereLight.
// 构造函数
// HemisphereLightHelper( light : HemisphereLight, sphereSize : Number, color : Hex )
// light -- 被模拟的光源.size -- 用于模拟光源的网格尺寸
//     .color -- (可选的) 如果没有赋值辅助对象将使用光源的颜色.
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

// DirectionalLightHelper
// 用于模拟场景中平行光 DirectionalLight 的辅助对象. 其中包含了表示光位置的平面和表示光方向的线段.构造函数
// DirectionalLightHelper( light : DirectionalLight, size : Number, color : Hex )
// light-- 被模拟的光源.size -- (可选的) 平面的尺寸. 默认为 1.
// color -- (可选的) 如果没有设置颜色将使用光源的颜色.
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper)

// 构造函数
// PolarGridHelper( radius : Number, sectors : Number, rings : Number, divisions : Number, color1 : Color, color2 : Color )
// radius -- 极坐标格半径. 可以为任何正数. 默认为 10.
// sectors -- The number of sectors the grid will be divided into. This can be any positive integer. Default is 16.
// rings -- The number of rings. This can be any positive integer. Default is 8.
// divisions -- 圆圈细分段数. 可以为任何大于或等于3的正整数. 默认为 64.
// color1 -- 极坐标格使用的第一个颜色. 值可以为 Color 类型, 16进制 和 CSS 颜色名. 默认为 0x444444
// color2 -- 极坐标格使用的第二个颜色. 值可以为 Color 类型, 16进制 和 CSS 颜色名. 默认为 0x888888
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

// 构造函数
// SpotLightHelper( light : SpotLight, color : Hex )
// light -- 被模拟的聚光灯 SpotLight
// .color -- (可选的) 如果没有赋值辅助对象将使用光源的颜色.
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper)
//请求windows 动画帧矫正聚光灯位置
window.requestAnimationFrame(() => {
    spotLightHelper.update()
})


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.position.x = -1.5

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material)

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material)
torus.position.x = 1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 2
camera.position.z = 4
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

const animate = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(animate)
}

animate()
