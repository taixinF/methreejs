    import '../style.css'
    import * as THREE from "three";
    import {
        OrbitControls
    } from "three/examples/jsm/controls/OrbitControls";
    import * as dat from 'dat.gui'

    /*
    *   debug
    * */
    const gui = new dat.GUI()


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
    const cubeTextureLoader = new THREE.CubeTextureLoader()

    const doorColorTexture = textureLoader.load('../static/textures/door/color.jpg')
    const doorAlphaTexture = textureLoader.load('../static/textures/door/alpha.jpg')
    const doorHeightTexture = textureLoader.load('../static/textures/door/height.jpg')
    const doorNormalTexture = textureLoader.load('../static/textures/door/normal.jpg')
    const doorAmbientOcclusionTexture = textureLoader.load('../static/textures/door/ambientOcclusion.jpg')
    const doorMetalnessTexture = textureLoader.load('../static/textures/door/metalness.jpg')
    const doorRoughnessTexture = textureLoader.load('../static/textures/door/roughness.jpg')
    const matcapTexture = textureLoader.load('../static/textures/matcaps/8.png')
    const gradientTexture = textureLoader.load('../static/textures/gradients/5.jpg')
    // material.gradientMap = gradientTexture
    // .magFilter : number
    // 当一个纹素覆盖大于一个像素时，贴图将如何采样。默认值为THREE.LinearFilter， 它将获取四个最接近的纹素，并在他们之间进行双线性插值。 另一个选项是THREE.NearestFilter，它将使用最接近的纹素的值。
    // 请参阅texture constants页面来了解详细信息。
    // .minFilter : number
    // 当一个纹素覆盖小于一个像素时，贴图将如何采样。默认值为THREE.LinearMipmapLinearFilter， 它将使用mipmapping以及三次线性滤镜。
    // 放大滤镜（Magnification Filters）
    // THREE.NearestFilter
    // THREE.LinearFilter
    // 这些常量用于纹理的magFilter属性，它们定义了当被纹理化的像素映射到小于或者等于1纹理元素（texel）的区域时，将要使用的纹理放大函数。
    gradientTexture.minFilter = THREE.NearestFilter
    gradientTexture.magFilter = THREE.NearestFilter
    gradientTexture.generateMipmaps = false

    const environmentMapTexture = cubeTextureLoader.load([
        '../static/textures/environmentMaps/5/px.png',
        '../static/textures/environmentMaps/5/nx.png',
        '../static/textures/environmentMaps/5/py.png',
        '../static/textures/environmentMaps/5/ny.png',
        '../static/textures/environmentMaps/5/pz.png',
        '../static/textures/environmentMaps/5/nz.png'
    ])


    /*
    Objects
     */
    /*
    .set ( value : Color_Hex_or_String ) : this value - 用于设置该颜色的值。      ---是一个类
     new THREE.Color()//设置颜色

     材质常量（Material Constants）
    .side : Integer
    定义将要渲染哪一面 - 正面，背面或两者。 默认为THREE.FrontSide。其他选项有THREE.BackSide和THREE.DoubleSide。
    面
    THREE.FrontSide
    THREE.BackSide
    THREE.DoubleSide
    定义了哪一边的面将会被渲染 —— 正面，或是反面，还是两个面都渲染。 默认值是FrontSide（只渲染正面）。
    * */
    // const material = new THREE.MeshBasicMaterial();
    // material.map = doorColorTexture
    // material.color = new THREE.Color('red')     //结合使用
    // material.wireframe = true
    // material.opacity = 0.5
    // material.transparent = true //透明
    // material.alphaMap = doorAlphaTexture //物体法线然物体展示该有的材质
    // material.side = THREE.DoubleSide

    // MeshMatcapMaterial 由一个材质捕捉（MatCap，或光照球（Lit Sphere））纹理所定义，其编码了材质的颜色与明暗。
    // const material = new THREE.MeshNormalMaterial()
    //.matcap : Texture
    // matcap贴图，默认为null。
    // const material = new THREE.MeshMatcapMaterial()
    // material.matcap = matcapTexture

    // 深度网格材质(MeshDepthMaterial)
    // 一种按深度绘制几何体的材质。深度基于相机远近平面。白色最近，黑色最远。
    // const material = new THREE.MeshDepthMaterial()

    // Lambert网格材质(MeshLambertMaterial) -------对光起作用的材料
    // 一种非光泽表面的材质，没有镜面高光。
    // 该材质使用基于非物理的Lambertian模型来计算反射率。 这可以很好地模拟一些表面（例如未经处理的木材或石材
    // ，但不能模拟具有镜面高光的光泽表面（例如涂漆木材）。 MeshLambertMaterial uses per-fragmet shading。
    // const material = new THREE.MeshLambertMaterial()
    // material.side = THREE.DoubleSide

    // Phong网格材质(MeshPhongMaterial)-------光反射更加强烈透彻
    // 一种用于具有镜面高光的光泽表面的材质。
    // 该材质使用非物理的Blinn-Phong模型来计算反射率。 与MeshLambertMaterial中使用的Lambertian模型不同，
    // 该材质可以模拟具有镜面高光的光泽表面（例如涂漆木材）。MeshPhongMaterial uses per-fragmet shading。
    //.shininess : Float
    //.specular高亮的程度，越高的值越闪亮。默认值为 30。
    // .specular : Color
    // 材质的高光颜色。默认值为0x111111（深灰色）的颜色Color。
    // const material = new THREE.MeshPhongMaterial()
    // material.shininess = 100 //光泽
    // material.specular = new THREE.Color(0xff0000)

    //MeshToonMaterial
    //.gradientMap : Texture
    // Gradient map for toon shading. It's required to set Texture.minFilter and Texture.magFilter to THREE.NearestFilter
    // when using this type of texture. Default is null.
    // const material = new THREE.MeshToonMaterial()
    // material.gradientMap = gradientTexture

    // 标准网格材质(MeshStandardMaterial)
    // 一种基于物理的标准材质，使用Metallic-Roughness工作流程。
    // 基于物理的渲染（PBR）最近已成为许多3D应用程序的标准，例如Unity， Unreal和 3D Studio Max。
    // .metalness : Float
    // 材质与金属的相似度。非金属材质，如木材或石材，使用0.0，金属使用1.0，通常没有中间值。 默认值为0.0。0.0到1.0之间的值可用于生锈金属的外观。
    // 如果还提供了metalnessMap，则两个值相乘。
    // .metalnessMap : Texture
    // 该纹理的蓝色通道用于改变材质的金属度。
    // .roughness : Float
    // 材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射。默认值为1.0。如果还提供roughnessMap，则两个值相乘。
    // .roughnessMap : Texture
    // 该纹理的绿色通道用于改变材质的粗糙度。
    // const material = new THREE.MeshStandardMaterial()
    //如果图层有金属度和很粗糙度可以不添加这两个属性
    // material.metalness = 0.3
    // material.roughness = 0.5
    // material.map = doorColorTexture
    // material.side = THREE.DoubleSide
    //环境遮挡贴图
    // .aoMap : Texture
    // 该纹理的红色通道用作环境遮挡贴图。默认值为null。aoMap需要第二组UV。
    // material.aoMap = doorAmbientOcclusionTexture
    //aoMapIntensity : Float
    // 环境遮挡效果的强度。默认值为1。零是不遮挡效果。
    // material.aoMapIntensity = 1
    // .displacementMap : Texture
    // 位移贴图会影响网格顶点的位置，与仅影响材质的光照和阴影的其他贴图不同，移位的顶点可以投射阴影，阻挡其他对象，
    // 以及充当真实的几何体。位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位。
    // .displacementScale : Float
    // material.displacementMap = doorHeightTexture
    // material.wireframe = true
    // displacementScale : Float
    // 位移贴图对网格的影响程度（黑色是无位移，白色是最大位移）。如果没有设置位移贴图，则不会应用此值。默认值为1。
    // material.displacementScale = 0.1
    // .metalnessMap : Texture
    // 该纹理的蓝色通道用于改变材质的金属度。
    // material.metalnessMap = doorMetalnessTexture
    // .roughnessMap : Texture
    // 该纹理的绿色通道用于改变材质的粗糙度。
    // material.roughnessMap = doorRoughnessTexture
    //.normalMap : Texture
    // 用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。法线贴图不会改变曲面的实际形状，只会改变光照。
    // In case the material has a normal map authored using the left handed convention,
    //=the y component of normalScale should be negated to compensate for the different handedness.
    // material.normalMap = doorNormalTexture
    //.normalScale : Vector2
    // 法线贴图对材质的影响程度。典型范围是0-1。默认值是Vector2设置为（1,1）。
    // 二维向量（Vector2）
    // 表示2D vector（二维向量）的类。 一个二维向量是一对有顺序的数字（标记为x和y），可用来表示很多事物，例如：
    // 一个位于二维空间中的点（例如一个在平面上的点）。
    // 一个在平面上的方向与长度的定义。在three.js中，长度总是从(0, 0)到(x, y)的 Euclidean distance（欧几里德距离，即直线距离）， 方向也是从(0, 0)到(x, y)的方向。
    // 任意的、有顺序的一对数字。
    // 其他的一些事物也可以使用二维向量进行表示，比如说动量矢量、复数等等；但以上这些是它在three.js中的常用用途。
    // 对 Vector2 实例进行遍历将按相应的顺序生成它的分量 (x, y)。
    // material.normalScale.set(0.5, 0.5)
    // material.transparent = true
    // .alphaMap : Texture
    // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。 默认值为null。
    // material.alphaMap = doorAlphaTexture

    // 二、环境贴图
    const material = new THREE.MeshStandardMaterial()
    material.metalness = 0.7
    material.roughness = 0.2
    material.envMap = environmentMapTexture

    gui.add(material, 'metalness').min(0).max(1).step(0.001)
    gui.add(material, 'roughness').min(0).max(1).step(0.001)
    gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001)
    gui.add(material, 'displacementScale').min(0).max(1).step(0.001)


    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material)
    sphere.position.x = -1.5
    sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))


    //PlaneGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
    // width — 平面沿着X轴的宽度。默认值是1。
    // height — 平面沿着Y轴的高度。默认值是1。
    // widthSegments — （可选）平面的宽度分段数，默认值是1。
    // heightSegments — （可选）平面的高度分段数，默认值是1。
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material)
    //.setAttribute ( name : String, attribute : BufferAttribute ) : this
    // 为当前几何体设置一个 attribute 属性。在类的内部，有一个存储 .attributes 的 hashmap， 通过该 hashmap，遍历 attributes 的速度会更快。
    // 而使用该方法，可以向 hashmap 内部增加 attribute。 所以，你需要使用该方法来添加 attributes。
    // 构造函数
    // BufferAttribute( array : TypedArray, itemSize : Integer, normalized : Boolean )
    // array -- 必须是 TypedArray. 类型，用于实例化缓存。
    //itemSize -- 队列中与顶点相关的数据值的大小。举例，如果 attribute 存储的是三元组（例如顶点空间坐标、法向量或颜色值）则itemSize的值应该是3。
    plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))


    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), material)
    torus.position.x = 1.5
    torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
    scene.add(sphere, plane, torus)


    /*
    * Lights
    * color - (可选参数)) 十六进制光照颜色。 缺省值 0xffffff (白色)。
    intensity - (可选参数) 光照强度。 缺省值 1。
    distance - 这个距离表示从光源到光照强度为0的位置。 当设置为0时，光永远不会消失(距离无穷大)。缺省值 0.
    decay - 沿着光照距离的衰退量。缺省值 1。 在 physically correct 模式中，decay = 2。
    * */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const light = new THREE.PointLight(0xffffff, 0.5)
    light.position.x = 2
    light.position.y = 3
    light.position.z = 4
    scene.add(light)

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
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.z = 3;
    scene.add(camera);

    //Axes helper
    // const axesHelper = new THREE.AxesHelper();
    // scene.add(axesHelper);

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
        // plane.rotation.y = 0.1 * elapsedTime
        torus.rotation.y = 0.1 * elapsedTime

        sphere.rotation.x = 0.1 * elapsedTime
        // plane.rotation.x = 0.1 * elapsedTime
        torus.rotation.x = 0.1 * elapsedTime

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate); //window
    }

    animate();
