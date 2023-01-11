import "../style.css";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import CANNON from "cannon";

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {}
debugObject.createSphere = () => {
    createSphere(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() - 0.5) * 3
    })
}
debugObject.createBox = () => {
    createBox(Math.random(), Math.random(), Math.random(), {
        x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() - 0.5) * 3
    })
}
// Reset
debugObject.reset = () => {
    for (const object of objectsToUpdate) {
        // Remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        // Remove mesh
        scene.remove(object.mesh)
    }
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/*
* Sounds
* */
const hitSound = new Audio('../static/textures/sounds/hit.mp3')

const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if (impactStrength > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()

    }
}
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load(["../static/textures/environmentMaps1/0/px.png", "../static/textures/environmentMaps1/0/nx.png", "../static/textures/environmentMaps1/0/py.png", "../static/textures/environmentMaps1/0/ny.png", "../static/textures/environmentMaps1/0/pz.png", "../static/textures/environmentMaps1/0/nz.png",]);

//physics
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world)//沿一个轴扫描和修剪宽相。
//allowSleep Boolean
// Defined in src/world/World.js:39
// 使身体在不活动时进入睡眠状态
world.allowSleep = true
world.gravity.set(0, -9.82, 0);

//Materials
const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.1, restitution: 0.7,
});
world.addContactMaterial(defaultContactMaterial)
//也可以直接给世界添加上材质
world.defaultContactMaterial = defaultContactMaterial

//sphere
// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//     mass: 1, position: new CANNON.Vec3(0, 3, 0), shape: sphereShape,
// });
// world.addBody(sphereBody);

//Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);
//四元数描述了 3D 空间中的旋转。四元数在数学上定义为 Q = x i + y j + z*k + w，其中 (i,j,k) 是虚基向量。
// (x,y,z) 可以看作是与旋转轴相关的向量，而实数乘数 w 与旋转量相关。
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5); //四元组
// applyLocalForce ( force  localPoint )
// Defined in src/objects/Body.js:665
// 对身体的局部点施力。
//     Parameters:
// force Vec3
// 要应用的力矢量，在主体框架中本地定义。 localPoint Vec3 身体中要施加力的局部点。
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
world.addBody(floorBody);


/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({
//     metalness: 0.3, roughness: 0.4, envMap: environmentMapTexture,
// }));
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({
    color: "#777777", metalness: 0.3, roughness: 0.4, envMap: environmentMapTexture,
}));
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth, height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


//Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereGeometryMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3, roughness: 0.4, envMap: environmentMapTexture
})
const objectsToUpdate = []
const createSphere = (radius, position) => {
    const mesh = new THREE.Mesh(sphereGeometry, sphereGeometryMaterial)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1, shape, material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)
    body.addEventListener('collide', playHitSound)
    objectsToUpdate.push({mesh, body})
}
// createSphere(0.5, {x: 0, y: 3, z: 0})
console.log(objectsToUpdate)


// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3, roughness: 0.4, envMap: environmentMapTexture
})
const createBox = (width, height, depth, position) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body = new CANNON.Body({
        mass: 1, position: new CANNON.Vec3(0, 3, 0), shape: shape, material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)
    body.addEventListener('collide', playHitSound)
    objectsToUpdate.push({mesh, body})
}

// createBox(1, 1.5, 2, {x: 0, y: 3, z: 0})


/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapseTime = 0;
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    //   step ( dt  [timeSinceLastCalled]  [maxSubSteps=10] )
    // 定义于 src/world/World.js:443
    // 及时推进物理世界。
    // 有两种模式。简单模式是固定时间步长，没有插值。在这种情况下，您只使用第一个参数。
    // 第二种情况使用插值。你还提供了自上次使用函数以来的时间，以及要采取的最大固定时间步长。
    // 参数：
    // dt 数字
    // 要使用的固定时间步长。
    // [timeSinceLastCalled] 号码 可选
    // 自上次调用函数以来经过的时间。
    // [maxSubSteps=10] 号码 可选
    // 每个函数调用要执行的最大固定步骤数。
    const deltaTim = elapsedTime - oldElapseTime;
    oldElapseTime = elapsedTime;

    //Upadate physics world
    //applyForce ( force  worldPoint )
    // 对世界点施加力。例如，这可以是 Body 表面上的一个点。以这种方式施加力将增加 Body.force 和 Body.torque。
    // force Vec3
    // 要添加的力的大小。
    // worldPoint Vec3
    // 施加力的世界点。
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
    world.step(1 / 60, deltaTim, 3);

    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        //.quaternion : Quaternion
        // 表示对象局部旋转的Quaternion（四元数）。
        object.mesh.quaternion.copy(object.body.quaternion)
    }


    // sphere.position.copy(sphereBody.position);

    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
