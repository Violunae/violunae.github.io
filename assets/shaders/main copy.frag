precision mediump float;

varying vec2 v_texcoord;

uniform vec2 iResolution;
uniform float iTime;

void main() {
    vec2 fragCoord = v_texcoord * iResolution;
    vec2 uv = fragCoord / iResolution.xy;
    uv.x *= 2.0;

    vec3 col1 = mix(vec3(0.1, 0.25, 0.5), vec3(0.4, 0.0, 0.25), uv.y);
    vec3 col2 = mix(vec3(0.1, 0.3, 0.5), vec3(0.5, 0.1, 0.5), uv.y);

    float angle = radians(45.0);
    mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

    vec2 ruv = (uv * vec2(20.0, 20.0)) * rotationMatrix;

    float val = abs(sin(ruv.x + (iTime * 0.5)) * sin(ruv.y - (iTime * 0.5)));

    float addVal = 0.5 * sin(uv.x * 200.0 - (iTime * 2.0)) * sin(uv.y * 200.0);
    float check = (val - (uv.y + addVal)) + 0.2;
    check = step(0.5, clamp(check * 3.0, 0.0, 1.0));
    vec3 col = mix(col1, col2, check);

    col = mix(col, vec3(0.2, 0.1, 0.2), sin(uv.y * 810.0));

    gl_FragColor = vec4(col, 1.0);
}