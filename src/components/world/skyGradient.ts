// One shared piece of shader code: "what color is the sky in a given
// direction?" The sky dome uses it to paint itself, and the ocean uses
// it to know what it's REFLECTING — that's why the water and the sky
// can never disagree.
//
// It returns the three-stop gradient (horizon → mid → top) plus the
// warm halo around the sun. The sun's hard disc is NOT included here:
// the dome adds it separately, and on the water the disc's reflection
// is played by the glints instead.

export const SKY_GRADIENT_GLSL = /* glsl */ `
  vec3 skyGradient(
    vec3 dir,          // which way we're looking (normalized)
    vec3 sunDir,       // where the sun is (normalized)
    vec3 topColor,
    vec3 midColor,
    vec3 horizonColor,
    vec3 sunColor
  ) {
    // 0 at the horizon, 1 straight up; below the horizon stays
    // horizon-colored. smoothstep eases the bands into each other.
    float height = clamp(dir.y, 0.0, 1.0);
    vec3 color = mix(horizonColor, midColor, smoothstep(0.02, 0.20, height));
    color = mix(color, topColor, smoothstep(0.18, 0.55, height));

    // The warm glow that surrounds the sun.
    float towardSun = clamp(dot(dir, sunDir), 0.0, 1.0);
    color += sunColor * pow(towardSun, 8.0) * 0.35;

    return color;
  }
`;
