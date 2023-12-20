export enum ShaderType {
  Vertex,
  Fragment
}

export interface WebGLProgram {
  _attributePosition: number;
  _attributeColor: number;
  _attributeTexcoord: number;
  _uniformBaseColor: WebGLUniformLocation;
  _uniformWorldMatrix: WebGLUniformLocation;
  _uniformViewMatrix: WebGLUniformLocation;
  _uniformProjectionMatrix: WebGLUniformLocation;
  _uniformBaseColorTexture: WebGLUniformLocation;
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

export const SamplerMagFilter = {
  Nearest: 9728,
  Linear: 9729,
} as const;
export type SamplerMagFilter = typeof SamplerMagFilter[keyof typeof SamplerMagFilter];

export const SamplerMinFilter = {
  Nearest: 9728,
  Linear: 9729,
  NearestMipmapNearest: 9984,
  LinearMipmapNearest: 9985,
  NearestMipmapLinear: 9986,
  LinearMipmapLinear: 9987,
} as const;
export type SamplerMinFilter = typeof SamplerMinFilter[keyof typeof SamplerMinFilter];

export const SamplerWrapMode = {
  ClampToEdge: 33071,
  MirroredRepeat: 33648,
  Repeat: 10497,
} as const;
export type SamplerWrapMode = typeof SamplerWrapMode[keyof typeof SamplerWrapMode];
