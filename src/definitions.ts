export enum ShaderType {
  Vertex,
  Fragment
}

export interface WebGLProgram {
  _attributePosition: number;
}

export interface WebGLBuffer {
  _vertexComponentNumber: number;
  _vertexNumber: number;
}