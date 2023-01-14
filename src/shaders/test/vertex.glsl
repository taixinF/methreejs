//如果使用ShaderMaterial 这以下三个都不需要了
//内置attributes和uniforms与代码一起传递到shaders。
//如果您不希望WebGLProgram向shader代码添加任何内容，则可以使用RawShaderMaterial而不是此类。
//uniform mat4 projectionMatrix;
//uniform mat4 viewMatrix;
//uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;
//这里是取的geometry中的属性
//还有这两个
//attribute vec3 position;
//attribute vec2 uv;
//这样可以从这里发送到片段代码中
varying vec2 vUv;
varying float vElevation;
//call automaticliy 自动调用 gpu 会自动调用这个函数
void main() {
    //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;

    modelPosition.z = elevation;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;


    //这一步要加上不然看不到图像
    gl_Position = projectionPosition;


    vUv = uv;
    vElevation = elevation;
}