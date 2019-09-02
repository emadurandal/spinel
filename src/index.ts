import { drawScene } from "./render.js";
import Mesh from "./Mesh.js";
import Material from "./Material.js";
import Context from "./Context.js";


export default function main(vertices: number[], vertexComponentNumber: number, vertexShaderStr: string, fragmentShaderStr: string) {
  const canvas = document.getElementById('world') as HTMLCanvasElement;
  const context = new Context(canvas);

  const material = new Material(context, vertexShaderStr, fragmentShaderStr);

  const mesh = new Mesh(material, context, vertices, vertexComponentNumber);

  const gl = context.gl;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  drawScene(gl, mesh);

  return true;
}