export function initWebGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl') as WebGLRenderingContext;

  if (gl == null) {
    alert('Failed to initialize WebGL.');
  }

  return gl;
}
