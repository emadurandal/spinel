import Spinel from '../dist/index.js'
import { VertexAttributeSet } from '../src/Mesh.js';

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
  gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}
`;

const vertexData: VertexAttributeSet = {
  position: [
    0.0,  -1.0,  0.0,
    1.0, 1.0,  0.0,
     -1.0, 1.0,  0.0
  ]
}

const vertexComponentNumber = 3;


const canvas = document.getElementById('world') as HTMLCanvasElement;
const context = new Spinel.Context(canvas);

const material = new Spinel.Material(context, vertexShaderStr, fragmentShaderStr);
const mesh = new Spinel.Mesh(material, context, vertexData);

const gl = context.gl;
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

mesh.draw();

