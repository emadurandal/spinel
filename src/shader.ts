import { ShaderType, WebGLProgram } from "./definitions.js";

function compileShader(gl: WebGLRenderingContext, shaderType: ShaderType, shaderStr: string) {

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

export function initProgram(gl: WebGLRenderingContext, vertexShaderStr: string, fragmentShaderStr: string) {
  var vertexShader = compileShader(gl, ShaderType.Vertex, vertexShaderStr) as WebGLShader;
  var fragmentShader = compileShader(gl, ShaderType.Fragment, fragmentShaderStr) as WebGLShader;

  const shaderProgram = gl.createProgram() as WebGLProgram;

  if (shaderProgram == null) {
    alert('Failed to create WebGL program.');
    return null;
  }

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
    return null
  }

  gl.useProgram(shaderProgram);

  shaderProgram._attributePosition = gl.getAttribLocation(shaderProgram, "a_position");
  gl.enableVertexAttribArray(shaderProgram._attributePosition);

  return shaderProgram;
}
