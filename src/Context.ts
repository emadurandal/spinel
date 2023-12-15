export class Context {
  private static _gl: WebGLRenderingContext;
  static setup(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl') as WebGLRenderingContext;

    if (gl == null) {
      alert('Failed to initialize WebGL.');
    }

    this._gl = gl;
  }

  static get gl() {
    return this._gl;
  }

  static get canvasWidth() {
    return this._gl.canvas.width;
  }

  static get canvasHeight() {
    return this._gl.canvas.height;
  }

  static get aspect() {
    return this.canvasWidth / this.canvasHeight;
  }

  static resize(width: number, height: number) {
    this._gl.canvas.width = width;
    this._gl.canvas.height = height;
    this._gl.viewport(0, 0, width, height);
  }
}
