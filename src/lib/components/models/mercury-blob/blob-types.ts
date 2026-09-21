import type { ColorRepresentation } from 'three';

/** Look & feel options, shared by every layer of the component stack. */
export interface MercuryOptions {
    /** Silver reflectance colour. */
    color?: ColorRepresentation;
    /** Swirl pattern scale (bigger = more swirls). */
    swirl?: number;
    /** Swirl flow speed. */
    flow?: number;
    /** How strongly the swirl bends the reflections. */
    warp?: number;
    /** Frequencies of the swirl layers (ax, ay, az, aw). */
    freq?: [number, number, number, number];
    /** Sphere subdivisions. */
    segments?: number;
}