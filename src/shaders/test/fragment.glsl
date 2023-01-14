varying vec2 vUv;
void main() {
    //    float strength = vUv.x;
    //    float strength = vUv.y;
    //    float strength = 1.0-vUv.y;
    //    float strength = vUv.y*10.0;
    //    float strength = vUv.y * 10.0;
    //    float strength = mod(vUv.y * 10.0, 1.0);
    //    float strength = mod(vUv.y * 10.0, 1.0);
    //    //step (等到的值，赋予的值)
    //    strength = step(0.5, strength);
    //    float strength = mod(vUv.y * 10.0, 1.0);
    //    strength = step(0.3, strength);
    //    float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    //    strength += step(0.8, mod(vUv.y * 10.0, 1.0));
    //    float strength = step (0.8, mod(vUv.x * 10.0, 1.0));
    //    strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
    //    float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    //    strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
    //    float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    //    barX *= step(0.8, mod(vUv.y * 10.0+0.2, 1.0));
    //    float barY = step(0.8, mod(vUv.x * 10.0+0.2, 1.0));
    //    barY *= step(0.4, mod(vUv.y * 10.0, 1.0));
    //    float strength = barY + barX;
    //    float strength = abs(vUv.x - 0.5);
    //    float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    //    float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    //    float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    //    float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    //    float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    //    float strength = square1 * square2;
    float strength = vUv.x;
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
