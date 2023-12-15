export type Gltf2Scene = {
  nodes?: number[],
  name?: string,
  extensions: Object,
  extras?: any
}

export type Gltf2Attribute = {
  POSITION: number,
  NORMAL?: number,
  TANGENT?: number,
  TEXCOORD_0?: number,
  TEXCOORD_1?: number,
  COLOR_0?: number,
  JOINTS_0?: number,
  WEIGHTS_0?: number
}

export type Gltf2Primitive = {
  attributes: Gltf2Attribute,
  indices?: number,
  material?: number,
  mode?: number,
  targets?: Object[],
  extensions?: Object,
  extras?: any
}

export type Gltf2Mesh = {
  primitives: Gltf2Primitive[],
  weights?: number[],
  name?: string,
  extensions: Object,
  extras?: any
}

export type Gltf2Node = {
  camera?: number,
  children?: number[],
  skin?: number,
  matrix?: number[],
  mesh?: number,
  rotation?: number[],
  scale?: number[],
  translation?: number[],
  weights?: number[],
  name?: string,
  extensions?: Object,
  extras?: any
}

export type Gltf2Skin = {
  inverseBindMatrices?: number,
  skeleton?: number,
  joints: number[],
  name?: string,
  extensions?: Object,
  extras?: any
}

export type Gltf2TextureInfo = {
  index: number,
  texCoord?: number,
  extensions?: Object,
  extras?: any
}

export type Gltf2OcclusionTextureInfo = {
  index: number,
  texCoord?: number,
  strength?: number,
  extensions?: Object,
  extras?: any
}


export type Gltf2NormalTextureInfo = {
  index: number,
  texCoord?: number,
  scale?: number,
  extensions?: Object,
  extras?: any
}

export type Gltf2PbrMetallicRoughness = {
  baseColorFactor?: number[],
  baseColorTexture?: Gltf2TextureInfo,
  metallicFactor?: number,
  roughnessFactor?: number,
  metallicRoughnessTexture?: Gltf2TextureInfo,
  extensions?: Object,
  extras?: any
}

export type Gltf2Material = {
  pbrMetallicRoughness?: Gltf2PbrMetallicRoughness,
  normalTexture?: Gltf2NormalTextureInfo,
  occlusionTexture? : Gltf2OcclusionTextureInfo,
  emissiveTexture?: Gltf2TextureInfo,
  emissiveFactor?: number[],
  alphaMode?: string,
  alphaCutoff?: number,
  doubleSided?: boolean,
  name?: string,
  extensions?: Object,
  extras?: any
}

export type Gltf2CameraOrthographic = {
  xmag: number,
  ymag: number,
  zfar: number,
  znear: number,
  extensions?: Object,
  extras?: any
}

export type Gltf2CameraPerspective = {
  aspectRatio?: number,
  yfov: number,
  zfar?: number,
  znear: number,
  extensions?: Object,
  extras?: any
}


export type Gltf2Camera = {
  orthographic?: Gltf2CameraOrthographic,
  perspective?: Gltf2CameraPerspective,
  type: "perspective" | "orthographic",
  name?: string,
  extensions?: Object,
  extras?: any
}

export type Gltf2Image = {
  uri?: string,
  mimeType?: string,
  bufferView?: number,
  name?: string,
  extensions?: Object,
  extras?: any
}


export type Gltf2AnimationChannelTarget = {
  node?: number,
  path: string,
  extensions?: Object,
  extras?: any
}

export type Gltf2AnimationChannel = {
  sampler: number,
  target: Gltf2AnimationChannelTarget,
  extensions?: Object,
  extras?: any
}

export type Gltf2AnimationSampler = {
  input: number,
  interpolation?: string,
  output: number,
  extensions?: Object,
  extras?: any
}

export type Gltf2Animation = {
  channels: Gltf2AnimationChannel,
  samplers: Gltf2AnimationSampler,
  name?: string,
  extensions?: Object,
  extras?: any
}

export type Gltf2Texture = {
  sampler?: number,
  source?: number,
  name?: string,
  extensions?: Object,
  extras?: any
}

export type Gltf2Sampler = {
  magFilter?: number,
  minFilter?: number,
  wrapS?: number,
  wrapT?: number,
  name?: string,
  extensions?: Object,
  extras?: any
}


export type Gltf2SparseValues = {
  bufferView: number,
  byteOffset?: number,
  extensions?: Object,
  extras?: any
}


export type Gltf2SparseIndices = {
  bufferView: number,
  byteOffset?: number,
  componentType: number,
  extensions?: Object,
  extras?: any
}

export type Gltf2Sparse = {
  count: number,
  indices?: Gltf2SparseIndices,
  values?: Gltf2SparseValues,
  extensions?: Object,
  extras?: any
}

export type Gltf2Accessor = {
  bufferView?: number,
  byteOffset?: number,
  componentType: number,
  normalized?: boolean,
  count: number,
  type: string,
  max?: number[],
  min?: number[],
  sparse?: Object,
  name?: string,
  extensions?: Object,
  extras?: any
}

export type Gltf2BufferView = {
  buffer: number,
  byteOffset?: number,
  byteLength: number,
  byteStride?: boolean,
  target: number,
  name?: string,
  extensions?: Object,
  extras?: any
}

export type Gltf2Buffer = {
  uri?: string,
  byteLength: number,
  name?: string,
  extensions?: Object,
  extras?: any
}


export type Gltf2Asset = {
  copyright?: string,
  generater?: string,
  version: string,
  minVersion?: string,
  extensions?: any,
  extras?: any
}

export type Gltf2 = {
  asset: Gltf2Asset,
  buffers: Gltf2Buffer[],
  scenes: Gltf2Scene[],
  scene: number,
  meshes: Gltf2Mesh[],
  nodes: Gltf2Node[],
  skins: Gltf2Skin[],
  materials: Gltf2Material[],
  cameras: Gltf2Camera[],
  images: Gltf2Image[],
  animations: Gltf2Animation[],
  textures: Gltf2Texture[],
  samplers: Gltf2Sampler[],
  accessors: Gltf2Accessor[],
  bufferViews: Gltf2BufferView[],
  extensionsUsed?: string[],
  extensions?: string[]
};
