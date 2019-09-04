import { ShaderType, WebGLProgram } from "./definitions.js";
import Context from "./Context.js";

export default class Material {
  private _program: WebGLProgram;

  constructor(context: Context, vertexShaderStr: string, fragmentShaderStr: string) {
    const gl = context.gl;
    var vertexShader = this.compileShader(gl, ShaderType.Vertex, vertexShaderStr) as WebGLShader;
    var fragmentShader = this.compileShader(gl, ShaderType.Fragment, fragmentShaderStr) as WebGLShader;

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
    gl.enableVertexAttribArray(shaderProgram._attributePosition);
    shaderProgram._attributeColor = gl.getAttribLocation(shaderProgram, "a_color");
    gl.enableVertexAttribArray(shaderProgram._attributeColor);

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

}

