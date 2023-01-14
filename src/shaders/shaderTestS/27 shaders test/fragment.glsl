//如果使用ShaderMaterial 不需要了
//内置attributes和uniforms与代码一起传递到shaders。
//如果您不希望WebGLProgram向shader代码添加任何内容，则可以使用RawShaderMaterial而不是此类。
//precision mediump float;

//要放在上面做作色器下面
uniform vec3 uColor;
//纹理采用smapler
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;
void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 2.0 + 0.5;
    //r g b ?
    gl_FragColor = textureColor;
}