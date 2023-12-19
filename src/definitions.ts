export enum ShaderType {
  Vertex,
  Fragment
}

export interface WebGLProgram {
  _attributePosition: number;
  _attributeColor: number;
  _uniformBaseColor: WebGLUniformLocation;
  _uniformWorldMatrix: WebGLUniformLocation;
  _uniformViewMatrix: WebGLUniformLocation;
  _uniformProjectionMatrix: WebGLUniformLocation;
}

export const CameraType = {
  Perspective: 0,
  Orthographic: 1,
} as const;
export type CameraType= typeof CameraType[keyof typeof CameraType];

export const CameraControllerType = {
  Orbit: 0,
  Walk: 1
} as const;
export type CameraControllerType = typeof CameraControllerType[keyof typeof CameraControllerType];

export const PrimitiveMode = {
  Points: 0,
  Lines: 1,
  LineLoop: 2,
  LineStrip: 3,
  Triangles: 4,
  TriangleStrip: 5,
  TriangleFan: 6
} as const;
export type PrimitiveMode = typeof PrimitiveMode[keyof typeof PrimitiveMode];
