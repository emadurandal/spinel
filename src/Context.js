export default class Context {
    constructor(canvas) {
        const gl = canvas.getContext('webgl');
        if (gl == null) {
            alert('Failed to initialize WebGL.');
        }
        this._gl = gl;
    }
    get gl() {
        return this._gl;
    }
}
