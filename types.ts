export enum ShapeType {
  SPHERE = 'sphere',
  CUBE = 'cube',
  HEART = 'heart',
  FLOWER = 'flower',
  SATURN = 'saturn',
  DNA = 'dna',
  FIREWORKS = 'fireworks'
}

export interface ParticleConfig {
  shape: ShapeType;
  colorStart: string;
  colorEnd: string;
  pointSize: number;
  noiseStrength: number;
  rotationSpeed: number;
}

export interface HandData {
  x: number; // -1 to 1
  y: number; // -1 to 1
  z: number; // Depth estimate
  isPinching: boolean;
  isPresent: boolean;
}

export interface GeminiResponse {
  shape: ShapeType;
  colorStart: string;
  colorEnd: string;
  description: string;
}
