// Vertex shader program
var VSHADER_SOURCE = null;
// Fragment shader program
var FSHADER_SOURCE = null;

function main() {  
    // Retrieve <canvas> element
    var canvas = document.getElementById('screen');  
    if (!canvas) { 
	console.log('Failed to retrieve the <canvas> element');
	return false; 
    }

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
	console.log('Failed to get the rendering context for WebGL');
	return;
    }

    // Set clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}
