

const vertexShaderStr = `
precision highp float;

attribute vec3 a_position;

void main(void) {
  gl_Position = vec4(a_position, 1.0);
}
`;

const fragmentShaderStr = `
precision highp float;

void main(void) {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

let attributePosition: number = -1;
const vertexComponentNumber = 3;
const vertexNumber = 3;


enum ShaderType {
  Vertex,
  Fragment
}

function initWebGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl') as WebGLRenderingContext;

  if (gl == null) {
    alert('Failed to initialize WebGL.');
  }

  return gl;
}

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

function initProgram(gl: WebGLRenderingContext) {
  var vertexShader = compileShader(gl, ShaderType.Vertex, vertexShaderStr) as WebGLShader;
  var fragmentShader = compileShader(gl, ShaderType.Fragment, fragmentShaderStr) as WebGLShader;

  const shaderProgram = gl.createProgram();

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

  attributePosition = gl.getAttribLocation(shaderProgram, "a_position");
  gl.enableVertexAttribArray(attributePosition);

  return shaderProgram;
}


function initBuffers(gl: WebGLRenderingContext) {
  const vertexBuffer = gl.createBuffer() as WebGLBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  var vertices = [
       0.0,  1.0,  0.0,
      -1.0, -1.0,  0.0,
       1.0, -1.0,  0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  return vertexBuffer;
}

function drawScene(gl: WebGLRenderingContext, vertexBuffer: WebGLBuffer) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(
    attributePosition,
    vertexComponentNumber, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, vertexNumber);
}


export default function main() {
  const canvas = document.getElementById('world') as HTMLCanvasElement;
  const gl = initWebGL(canvas);

  if (gl == null) {
    return false;
  }
  initProgram(gl);

  const vertexBuffer = initBuffers(gl);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  drawScene(gl, vertexBuffer, shaderProgram);

  return true;
}