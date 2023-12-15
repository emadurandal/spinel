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
