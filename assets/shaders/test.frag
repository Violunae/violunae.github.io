precision mediump float;

varying vec2 v_texcoord;

uniform vec2 iResolution;
uniform float iTime;

float mandelbulb(vec3 p) {
    vec3 z = p;
    float dr = 1.0;
    float r = 0.0;
    for (int i = 0; i < 8; i++) {
        r = length(z);
        if (r > 2.0) break;

        float theta = acos(z.z / r);
        float phi = atan(z.y, z.x);
        float power = 8.0 + sin(iTime * 0.5) * 2.0;

        float zr = pow(r, power);
        theta *= power;
        phi *= power;

        z = zr * vec3(
            sin(theta) * cos(phi),
            sin(phi) * sin(theta),
            cos(theta)
        ) + p;

        dr = pow(r, power - 1.0) * power * dr + 1.0;
    }
    return 0.5 * log(r) * r / dr;
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        mandelbulb(p + e.xyy) - mandelbulb(p - e.xyy),
        mandelbulb(p + e.yxy) - mandelbulb(p - e.yxy),
        mandelbulb(p + e.yyx) - mandelbulb(p - e.yyx)
    ));
}

vec3 render(vec2 uv, out float tOut) {
    vec3 ro = vec3(0.0, 0.0, -3.0 + sin(iTime * 0.5) * 0.5);
    vec3 rd = normalize(vec3(uv, 1.5));

    float t = 0.0;
    float d;
    bool hit = false;

    for (int i = 0; i < 100; i++) {
        vec3 p = ro + t * rd;
        d = mandelbulb(p);
        if (d < 0.001) {
            hit = true;
            break;
        }
        t += d;
        if (t > 6.0) break;
    }

    vec3 col = vec3(0.0);
    if (hit) {
        vec3 p = ro + t * rd;
        vec3 n = getNormal(p);
        vec3 lightDir = normalize(vec3(0.6, 0.7, -0.4));
        float diff = clamp(dot(n, lightDir), 0.0, 1.0);
        float fresnel = pow(1.0 - dot(rd, n), 3.0);
        col = mix(vec3(0.2, 0.4, 0.9), vec3(1.0, 0.6, 0.2), diff);
        col += fresnel;
        col *= exp(-t * 0.3);
    }

    col += 0.01 / length(uv) * vec3(0.4, 0.5, 1.0);
    tOut = t;
    return col;
}

void main() {
    vec2 fragCoord = v_texcoord * iResolution;
    vec2 uv = fragCoord / iResolution - 0.5;
    uv *= iResolution / iResolution.y;

    float t;
    vec3 color = render(uv, t);

    float fogAmount = smoothstep(0.0, 3.0, t);
    vec3 fogColor = vec3(0.1, 0.2, 0.5);
    color = mix(color, fogColor, fogAmount);

    gl_FragColor = vec4(color * 0.5, 1.0);
}
