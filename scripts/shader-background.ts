function compileShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error("Failed to create shader");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("Shader compilation failed: " + info);
    }

    return shader;
}

async function init() {

    const canvas = document.getElementById("shaderCanvas") as HTMLCanvasElement;
    if (!canvas) {
        throw new Error("Canvas element not found");
    }

    const gl = canvas.getContext("webgl") as WebGLRenderingContext;
    if (!gl) {
        throw new Error("WebGL not supported");
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    async function loadShaderSource(name: string, type: 'vert' | 'frag'): Promise<string> {
      const path = `/assets/shaders/${name}.${type}`;
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load shader: ${path}`);
      }
      return await response.text();
    }

    const vertexShaderSource = await loadShaderSource("main", "vert");
    const fragmentShaderName = canvas.dataset.shader || "main";
    const fragmentShaderSource = await loadShaderSource(fragmentShaderName, "frag");

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
        throw new Error("Failed to create shader program");
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const vertices = new Float32Array([
        -1.0,  1.0,
        -1.0, -1.0,
        1.0,  1.0,
        1.0, -1.0,
    ]);

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        throw new Error("Failed to create buffer");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "iResolution");
    const timeUniformLocation = gl.getUniformLocation(shaderProgram, "iTime");

    animate(canvas, gl, resolutionUniformLocation, timeUniformLocation);
}

function animate(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, resolutionUniformLocation: WebGLUniformLocation | null, timeUniformLocation: WebGLUniformLocation | null): void {
    canvas.width = window.innerWidth * window.devicePixelRatio * 0.5;
    canvas.height = window.innerHeight * window.devicePixelRatio * 0.5;

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const time = performance.now() / 1000;

    if (resolutionUniformLocation)
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    if (timeUniformLocation)
        gl.uniform1f(timeUniformLocation, time);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(() => animate(canvas, gl, resolutionUniformLocation, timeUniformLocation));
}

init();
