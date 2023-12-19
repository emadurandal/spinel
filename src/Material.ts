import { ShaderType, WebGLProgram } from "./definitions.js";
import { System } from "./System.js";
import { Vector4 } from "./math/Vector4.js";

export class Material {
  private static readonly vertexShaderStr = `
precision highp float;

attribute vec3 a_position;
attribute vec4 a_color;
varying vec4 v_color;
uniform mat4 u_worldMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

void main(void) {
  gl_Position = u_projectionMatrix * u_viewMatrix * u_worldMatrix * vec4(a_position, 1.0);
  v_color = a_color;
}
`;

private static readonly fragmentShaderStr = `
precision highp float;

varying vec4 v_color;
uniform vec4 u_baseColor;

void main(void) {
  gl_FragColor = v_color * u_baseColor;
}
`;

  private _program: WebGLProgram;
  private _baseColor = new Vector4(1, 1, 1, 1);

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

    shaderProgram._uniformBaseColor = gl.getUniformLocation(shaderProgram, 'u_baseColor')!;
    shaderProgram._uniformWorldMatrix = gl.getUniformLocation(shaderProgram, 'u_worldMatrix')!;
    shaderProgram._uniformViewMatrix = gl.getUniformLocation(shaderProgram, 'u_viewMatrix')!;
    shaderProgram._uniformProjectionMatrix = gl.getUniformLocation(shaderProgram, 'u_projectionMatrix')!;

    this._program = shaderProgram;

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

  setUniformValues(gl: WebGLRenderingContext) {
    gl.uniform4fv(this._program._uniformBaseColor, this._baseColor.raw);
  }

  set baseColor(color: Vector4) {
    this._baseColor = color;
  }

  get baseColor(): Vector4 {
    return this._baseColor;
  }

  useProgram(gl: WebGLRenderingContext) {
    gl.useProgram(this._program);
  }
}

