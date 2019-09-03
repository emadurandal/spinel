import { ShaderType } from "./definitions.js";
export default class Material {
    constructor(context, vertexShaderStr, fragmentShaderStr) {
        const gl = context.gl;
        var vertexShader = this.compileShader(gl, ShaderType.Vertex, vertexShaderStr);
        var fragmentShader = this.compileShader(gl, ShaderType.Fragment, fragmentShaderStr);
        const shaderProgram = gl.createProgram();
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
        this._program = shaderProgram;
    }
    compileShader(gl, shaderType, shaderStr) {
        let shader;
        if (shaderType == ShaderType.Vertex) {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }
        else if (shaderType == ShaderType.Fragment) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        if (shader == null) {
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
        return this._program;
    }
}
