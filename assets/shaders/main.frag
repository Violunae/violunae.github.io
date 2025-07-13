precision mediump float;

varying vec2 v_texcoord;

uniform vec2 iResolution;
uniform float iTime;

void main() {
    vec2 fragCoord = v_texcoord * iResolution;
    vec2 uv = fragCoord / iResolution.xy;

    gl_FragColor = vec4(uv, 0.0, 1.0);
}