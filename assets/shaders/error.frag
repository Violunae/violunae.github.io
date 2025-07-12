precision mediump float;

varying vec2 v_texcoord;

uniform vec2 iResolution;
uniform float iTime;

float squareLen(vec2 v) {
    return max(abs(v.x), abs(v.y));
}

float segLine(vec2 p, vec2 a, vec2 b, float w) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return squareLen(pa - ba * h) - w;
}

float digitSDF(int d, vec2 p) {
    float w = 0.07;
    float dst = 1.0;
    if (d == 0) {
        dst = min(dst, segLine(p, vec2(-0.4,  0.9), vec2( 0.4,  0.9), w));
        dst = min(dst, segLine(p, vec2(-0.4, -0.9), vec2( 0.4, -0.9), w));
        dst = min(dst, segLine(p, vec2(-0.45, 0.8), vec2(-0.45,-0.8), w));
        dst = min(dst, segLine(p, vec2( 0.45, 0.8), vec2( 0.45,-0.8), w));
    } else if (d == 4) {
        dst = min(dst, segLine(p, vec2(-0.45, 0.9), vec2(-0.45, 0.2), w));
        dst = min(dst, segLine(p, vec2( 0.45, 0.9), vec2( 0.45,-0.8), w));
        dst = min(dst, segLine(p, vec2(-0.45, 0.2), vec2( 0.45, 0.2), w));
    }
    return dst;
}

void main() {
    vec2 fragCoord = v_texcoord * iResolution;
    vec2 uv = fragCoord/iResolution.xy;

    vec3 col = mix(vec3(1.0, 0.0, 0.0), vec3(0.2, 0.1, 0.2), sin(uv.y * 810.0));

    float scale = 6.0;
    float spacing = 2.0;
    float scan = 1.0 - mod(iTime * 0.1, 1.0);
    vec2 p = (vec2(uv.x, scan) - 0.5);
    p *= vec2(6.0, 2.5);

    float dCentre = digitSDF(0, p);
    float dLeft   = digitSDF(4, p + vec2(-spacing, 0.0));
    float dRight  = digitSDF(4, p + vec2( spacing, 0.0));
    float dist = min(dCentre, min(dLeft, dRight));

    if (dist < 0.0) col = vec3(0.0);

    if ((uv.y > scan) && (uv.y < scan + 0.01)) col = vec3(0.0, 1.0, 1.0);

    float barrel = length(uv) * 0.02;
    col *= 0.95 + 0.05 * sin(iTime * 60.0);
    col = mix(col, vec3(0.2, 0.1, 0.2), sin(uv.y * 810.0));
    col *= 1.0 - barrel;

    gl_FragColor = vec4(col, 1.0);
}
