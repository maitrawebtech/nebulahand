import { ShapeType } from './types';

export const PARTICLE_COUNT = 4000;
export const CAMERA_FOV = 75;
export const INITIAL_CONFIG = {
  shape: ShapeType.SPHERE,
  colorStart: '#00ffff',
  colorEnd: '#ff00ff',
  pointSize: 0.15,
  noiseStrength: 0.2,
  rotationSpeed: 0.2,
};

// CDN Links for MediaPipe to avoid local bundler issues with WASM
export const MEDIAPIPE_HANDS_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/";
