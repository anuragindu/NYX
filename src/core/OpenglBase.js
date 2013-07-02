

OpenglClasses = (function () {

    //----------------------------Buffer---------------------------//
    var glBuffer = function (gl, type, data, bufferOptions) {
        this.bindBuffer = function () {
            gl.bindBuffer(type, buffer);
        }
        this.setData = function (data) {
            this.bindBuffer();
            var bufferArray;
            if (bufferOptions.bufferType) {
                bufferArray = new bufferOptions.bufferType(data);
            } else if (bufferOptions.bufferConverter) {
                bufferArray = bufferOptions.bufferConverter();
            } else {
                throw "Cannot create buffer data.";
            }
            gl.bufferData(type, bufferArray, gl.STATIC_DRAW);
            this.itemSize = bufferOptions.itemSize;
            this.itemCount = data.lenght / bufferOptions.itemSize;
        };
        var buffer = gl.createBuffer();
        if (data) {
            this.setData(data);
        }
    }
    , glArrayBuffer = function (gl, data, bufferOptions) {
        glBuffer.call(this, gl, gl.ARRAY_BUFFER, data, bufferOptions);
    }
    , glIndexBuffer = function (gl, data) {
        var bufferOptions = {
            bufferType: Uint16Array,
            itemSize: 1
        };
        glBuffer.call(this, gl, gl.ELEMENT_ARRAY_BUFFER, data, bufferOptions);
    }
    , glVertexArrayBuffer = function (gl, data) {
        var bufferOptions = {
            bufferType: Float32Array,
            itemSize: 3
        };
        glArrayBuffer.call(this, gl, data, bufferOptions);
    }
    , glTextureArrayBuffer = function (gl, data, bufferOptions) {
        var bufferOptions = {
            bufferType: Float32Array,
            itemSize: 2
        };
        glArrayBuffer.call(this, gl, data, bufferOptions);
    };
    //-------------------------------------------------------------//

    //--------------------------Model------------------------------//

    var Model = function (gl, options) {
        function createResource() {
        }
        function mapModelToEffect() {
        }
    };

    var Effect = function (_gl, options) {
        this.useEffect = function () {
            if(Effect.currentEffect !== this){
                /// <summary> Use this effect. </summary>
                _gl.useProgram(shaderProgram);
                Effect.currentEffect = this;
            }
        };
        this.getAttribute = function (name) {
            return this.attributes[name];
        };
        this.getUniform = function (name) {
            return this.uniforms[name];
        };
        function registerAttributes() {
            this.attributes = {};
            for (var attr in options.attributes) {
                this.attributes[attr] = _gl.getAttribLocation(shaderProgram, attr);
            }
        }
        function registerUniforms() {
            this.uniforms = {};
            for (var unif in options.uniforms) {
                this.uniforms[unif] = _gl.getUniformLocation(shaderProgram, unif);
            }
        }
        function loadShader(type, program) {
            /// <param name="type" type="Number" integer="true">The shader type</param>
            /// <param name="program" type="String">The shader code</param>
            /// <returns type="Object">Shader</returns>
            var shader = _gl.createShader(type);
            _gl.shaderSource(shader, program);
            _gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
                alert('Error compiling shader' + _gl.getShaderInfoLog(shader));
                _gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        var vertexShader = loadShader(gl.VERTEX_SHADER, options.vertexShader),
        fragmentShader = loadShader(gl.FRAGMENT_SHADER, options.fragementShader),
        shaderProgram = _gl.createProgram();
        _gl.attachShader(shaderProgram, vertexShader);
        _gl.attachShader(shaderProgram, fragmentShader);
        _gl.linkProgram(shaderProgram);
        registerAttributes();
        registerUniforms();
    };

    //-------------------------------------------------------------//

    return {
        buffers: {
            glVertexArrayBuffer: glVertexArrayBuffer,
            glTextureArrayBuffer: glTextureArrayBuffer,
            glArrayBuffer: glArrayBuffer,
            glIndexBuffer: glIndexBuffer
        },
        model: Model,
        effect: Effect
    };

} ());