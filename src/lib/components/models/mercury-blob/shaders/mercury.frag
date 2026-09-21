uniform float u_time;
uniform vec3 u_color;
uniform vec3 u_keyPos;
uniform vec3 u_keyColor;
uniform vec3 u_rimPos;
uniform vec3 u_rimColor;

// driven by component props
uniform float u_swirl;  // pattern scale (bigger = more swirls)
uniform float u_flow;   // flow speed
uniform float u_warp;   // how strongly the pattern bends reflections
uniform vec4 u_freq;    // frequencies of the swirl layers (ax, ay, az, aw)

varying vec2 vUv;
varying float vDisplacement;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vSphere;

const float PI = 3.14159265;
const float ROUGHNESS = 0.05;       // mirror-like surface reflections
const float LIGHT_ROUGHNESS = 0.2;  // wider glints from the point lights

// High-contrast chrome-style studio: bright sky, sharp dark
// horizon, darker floor and a few soft boxes. Mercury gets its
// look from these hard reflected edges, so they stay neutral.
vec3 envMap(vec3 d) {
    float a = u_time * 2.0;
    d = vec3(cos(a) * d.x + sin(a) * d.z, d.y, -sin(a) * d.x + cos(a) * d.z);
    float h = d.y;

    vec3 sky = mix(vec3(0.04, 0.045, 0.055), vec3(1.15, 1.2, 1.3), smoothstep(0.0, 0.85, h));
    vec3 ground = mix(vec3(0.02), vec3(0.45, 0.44, 0.42), 1.0 - smoothstep(-0.9, 0.0, h));
    vec3 col = mix(ground, sky, smoothstep(-0.02, 0.02, h));

    // thin bright line hovering above the horizon
    col += vec3(1.0) * 0.9 * exp(-pow((h - 0.07) * 28.0, 2.0));

    // soft boxes
    col += vec3(1.0) * 3.5 * smoothstep(0.86, 0.94, dot(d, normalize(vec3(0.5, 0.7, 0.6))));
    col += vec3(0.85, 0.92, 1.0) * 2.5 * smoothstep(0.80, 0.90, dot(d, normalize(vec3(-0.8, -0.1, -0.5))));
    col += vec3(1.0, 0.92, 0.82) * 2.0 * smoothstep(0.88, 0.95, dot(d, normalize(vec3(-0.3, 0.3, 0.9))));
    col += vec3(1.0) * 1.5 * smoothstep(0.92, 0.97, dot(d, normalize(vec3(0.9, -0.2, -0.3))));
    return col;
}

// Swirling domain-warped field (same idea as the shader-art sample):
// a few sin/cos layers warp each other's coordinates. Fed with the
// sphere direction so it is continuous with no UV seam.
float cheapNoise(vec3 p) {
    return mix(
        sin(p.z + p.x * u_freq.x + cos(p.x * u_freq.x - p.z)) *
        cos(p.z + p.y * u_freq.y + cos(p.y * u_freq.x + p.z)),
        sin(1.0 + p.x * u_freq.z + p.z + cos(p.y * u_freq.w - p.z)) *
        cos(1.0 + p.y * u_freq.w + p.z + cos(p.x * u_freq.x + p.z)),
        0.436
    );
}

float pattern(vec3 s) {
    float T = u_time * u_flow;
    vec2 st = s.xy * u_swirl;
    float z = s.z * 1.5;
    float S = sin(T * 0.005);
    float C = cos(T * 0.005);

    vec2 v1 = vec2(cheapNoise(vec3(st, z + 2.0)), cheapNoise(vec3(st, z + 1.0)));
    vec2 v2 = vec2(
        cheapNoise(vec3(st + v1 + vec2(C * 1.7, S * 9.2), z + 0.15 * T)),
        cheapNoise(vec3(st + v1 + vec2(S * 8.3, C * 2.8), z + 0.126 * T))
    );
    return 0.5 + 0.5 * cheapNoise(vec3(st + v2, z));
}

float dGGX(float NoH, float a) {
    float a2 = a * a;
    float d = NoH * NoH * (a2 - 1.0) + 1.0;
    return a2 / (PI * d * d);
}

vec3 pointLight(vec3 pos, vec3 lightCol, float intensity, vec3 N, vec3 V, vec3 F0) {
    vec3 L = normalize(pos - vWorldPos);
    vec3 H = normalize(L + V);
    float NoL = max(dot(N, L), 0.0);
    float NoH = max(dot(N, H), 0.0);
    float LoH = max(dot(L, H), 0.001);

    vec3 F = F0 + (1.0 - F0) * pow(1.0 - LoH, 5.0);
    float a = LIGHT_ROUGHNESS * LIGHT_ROUGHNESS;
    vec3 spec = dGGX(NoH, a) * F / (4.0 * LoH * LoH);
    return spec * NoL * lightCol * intensity;
}

vec3 aces(vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
    vec3 N = normalize(vNormal);
    if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(cameraPosition - vWorldPos);

    // Treat the swirl pattern as a height field and use its gradient
    // to bend the normal. The mirror-like reflections then ripple and
    // flow like liquid mercury, with no colour added.
    vec3 s = normalize(vSphere);
    vec3 T = normalize(cross(s, abs(s.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
    vec3 B = cross(s, T);
    const float e = 0.03;
    float h0 = pattern(s);
    float ht = pattern(s + T * e);
    float hb = pattern(s + B * e);
    vec3 grad = ((ht - h0) * T + (hb - h0) * B) / e;
    N = normalize(N - u_warp * grad);

    float NoV = max(dot(N, V), 0.0);

    // Pure metal: no diffuse, reflectance is the silver colour
    vec3 F0 = u_color;
    vec3 F = F0 + (1.0 - F0) * pow(1.0 - NoV, 5.0);

    vec3 R = reflect(-V, N);
    vec3 color = envMap(R) * F;

    color += pointLight(u_keyPos, u_keyColor, 0.6, N, V, F0);
    color += pointLight(u_rimPos, u_rimColor, 0.4, N, V, F0);

    // faint darkening in the troughs of the noise and pattern for depth
    color *= mix(0.8, 1.0, smoothstep(-0.9, 0.3, vDisplacement));
    color *= mix(0.78, 1.12, smoothstep(0.15, 0.85, h0));

    color = pow(aces(color), vec3(1.0 / 2.2));
    gl_FragColor = vec4(color, 1.0);
}
