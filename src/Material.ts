import { SamplerMagFilter, SamplerMinFilter, SamplerWrapMode, ShaderType, WebGLProgram } from "./definitions.js";
import { System } from "./System.js";
import { Vector4 } from "./math/Vector4.js";
import { Texture2D } from "./Texture.js";

export class Material {
  private static readonly vertexShaderStr = `#version 300 es
precision highp float;

in vec3 a_position;
in vec4 a_color;
in vec2 a_texcoord;
out vec4 v_color;
out vec2 v_texcoord;
uniform mat4 u_worldMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

void main(void) {
  gl_Position = u_projectionMatrix * u_viewMatrix * u_worldMatrix * vec4(a_position, 1.0);
  v_color = a_color;
  v_texcoord = a_texcoord;
}
`;

private static readonly fragmentShaderStr = `#version 300 es
precision highp float;
layout(location = 0) out vec4 rt0;

in vec4 v_color;
in vec2 v_texcoord;
uniform vec4 u_baseColor;
uniform sampler2D u_baseColorTexture;

void main(void) {
  rt0 = v_color * u_baseColor * texture(u_baseColorTexture, v_texcoord);
}
`;

  private _program: WebGLProgram;
  private _baseColor = new Vector4(1, 1, 1, 1);
  private _baseColorTexture?: Texture2D;
  private static _defaultWhiteTexture: Texture2D;

  constructor() {
    const gl = System.gl;
    const vertexShader = this.compileShader(gl, ShaderType.Vertex, Material.vertexShaderStr) as WebGLShader;
    const fragmentShader = this.compileShader(gl, ShaderType.Fragment, Material.fragmentShaderStr) as WebGLShader;

    const shaderProgram = gl.createProgram() as WebGLProgram;

    if (shaderProgram == null) {
      alert('Failed to create WebGL program.');
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram._attributePosition = gl.getAttribLocation(shaderProgram, "a_position");
    shaderProgram._attributeColor = gl.getAttribLocation(shaderProgram, "a_color");
    shaderProgram._attributeTexcoord = gl.getAttribLocation(shaderProgram, "a_texcoord");

    shaderProgram._uniformBaseColor = gl.getUniformLocation(shaderProgram, 'u_baseColor')!;
    shaderProgram._uniformWorldMatrix = gl.getUniformLocation(shaderProgram, 'u_worldMatrix')!;
    shaderProgram._uniformViewMatrix = gl.getUniformLocation(shaderProgram, 'u_viewMatrix')!;
    shaderProgram._uniformProjectionMatrix = gl.getUniformLocation(shaderProgram, 'u_projectionMatrix')!;
    shaderProgram._uniformBaseColorTexture = gl.getUniformLocation(shaderProgram, 'u_baseColorTexture')!;

    this._program = shaderProgram;

    if (Material._defaultWhiteTexture == null) {
      Material._defaultWhiteTexture = new Texture2D();
      Material._defaultWhiteTexture.load1x1(new Vector4(1, 1, 1, 1), {
        magFilter: SamplerMagFilter.Nearest,
        minFilter: SamplerMinFilter.Nearest,
        wrapS: SamplerWrapMode.Repeat,
        wrapT: SamplerWrapMode.Repeat,
        generateMipmap: false
      });
    }
  }


  compileShader(gl: WebGLRenderingContext, shaderType: ShaderType, shaderStr: string) {

    let shader: WebGLShader | null;
    if (shaderType == ShaderType.Vertex) {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else if (shaderType == ShaderType.Fragment) {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }

    if (shader! == null) {
      alert('Failed to create WebGL shader.');
      return null;
    }

    gl.shaderSource(shader, shaderStr);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  get program() {
    return this._program
  }

  setUniformValues() {
    const gl = System.gl;
    gl.uniform4fv(this._program._uniformBaseColor, this._baseColor.raw);
    gl.uniform1i(this._program._uniformBaseColorTexture, 0);
  }

  setTextures() {
    if (this._baseColorTexture != null) {
      this._baseColorTexture.bind();
    } else {
      Material._defaultWhiteTexture.bind();
    }
  }

  setBaseColor(color: Vector4) {
    this._baseColor = color;
  }

  getBaseColor(): Vector4 {
    return this._baseColor.clone();
  }

  setBaseColorTexture(texture: Texture2D) {
    this._baseColorTexture = texture;
  }

  useProgram() {
    const gl = System.gl;
    gl.useProgram(this._program);
  }
}

