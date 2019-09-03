export default class Mesh {
    constructor(material, context, vertexData) {
        this._vertexNumber = 0;
        this._material = material;
        this._context = context;
        const gl = context.gl;
        this._vertexNumber = vertexData.position.length / Mesh._positionComponentNumber;
        // position
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData.position), gl.STATIC_DRAW);
        this._positionBuffer = positionBuffer;
        // color
        if (vertexData.color) {
            const colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData.color), gl.STATIC_DRAW);
            this._colorBuffer = colorBuffer;
        }
    }
    draw() {
        const gl = this._context.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        gl.vertexAttribPointer(this.material.program._attributePosition, Mesh._positionComponentNumber, gl.FLOAT, false, 0, 0);
        if (this._colorBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
            gl.vertexAttribPointer(this.material.program._attributePosition, Mesh._positionComponentNumber, gl.FLOAT, false, 0, 0);
        }
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexNumber);
    }
    get vertexNumber() {
        return this._vertexNumber;
    }
    get material() {
        return this._material;
    }
}
Mesh._positionComponentNumber = 3;
