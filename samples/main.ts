import Spinel from '../dist/index.js'
import Vector4 from '../dist/Vector4.js';

const vertexShaderStr = `
precision highp float;

attribute vec3 a_position;
attribute vec4 a_color;
varying vec4 v_color;

void main(void) {
  gl_Position = vec4(a_position, 1.0);
  v_color = a_color;
}
`;

const fragmentShaderStr = `
precision highp float;

varying vec4 v_color;
uniform vec4 u_baseColor;

void main(void) {
  gl_FragColor = v_color * u_baseColor;
}
`;


async function main() {

  const canvas = document.getElementById('world') as HTMLCanvasElement;
  const context = new Spinel.Context(canvas);
  const material = new Spinel.Material(context, vertexShaderStr, fragmentShaderStr);
  material.baseColor = new Vector4(1, 0, 0, 1);
  const glTF2Importer = Spinel.Gltf2Importer.getInstance();
  const meshes = await glTF2Importer.import('../assets/gltf/BoxAnimated/glTF/BoxAnimated.gltf', context, material);

  const gl = context.gl;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (let mesh of meshes) {
    mesh.draw();
  }

}

main();