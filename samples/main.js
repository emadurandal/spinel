import main from '../dist/index.js';

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

const vertices = [
  0.0,  -1.0,  0.0,
  1.0, 1.0,  0.0,
   -1.0, 1.0,  0.0
]
main(vertices, 3, vertexShaderStr, fragmentShaderStr);
