// Loadshaderfromfiles.js based on ColoredTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = null;
// Fragment shader program
var FSHADER_SOURCE = null;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  // Read shader from file
  readShaderFile(gl, 'ColoredTriangle.vert', 'v');
  readShaderFile(gl, 'ColoredTriangle.frag', 'f');
}

function start(gl) {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  
  //To do: Dado o pgn variável string do arquvo .pgn carregado do html
    	//To do: Criar uma fila dos movimentos{tipo peça, posição inicial, posição final, ...}
            //To do: parser do pgn
    
    //To do: Inicializar hashmap dos objetos{chave=posição, valor=objeto}
      //To do: Carregar bispo
         //To do: Ler arquivo
         //To do: Parser
           //To do: return bispo{tipo de peça, posição}
      //To do: Caregar cavalo
      //To do: ...
      
   //To do: Carregar tabuleiro

  // Set vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Start drawing
    var tick = function() {
	
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	// Draw the rectangle
	gl.drawArrays(gl.TRIANGLES, 0, n);
    	//To do: Update Args das operações
    	
    	   // To do:Ler evento de movimento do mouse
    	   
    	   	//To do: Atualizar argumento de Rotação
    	   	
    	   	//To do: Atualizar argumento de Scale
    	   //To do: Pop do movimento
    	   
    	   	//To do: Atualizar argumento da posição
    	   	
    	//To do: Loop para cada peça
    	
    	   //To do: Draw the triangle
    	
    	// Request that the browser calls tick
    	requestAnimationFrame(tick, canvas);
    };
    tick()
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // Vertex coordinates and color
     0.0,  0.5,  1.0,  0.0,  0.0, 
    -0.5, -0.5,  0.0,  1.0,  0.0, 
     0.5, -0.5,  0.0,  0.0,  1.0, 
  ]);
  var n = 3;

  // Create a buffer object
  var vertexColorBuffer = gl.createBuffer();  
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_Position, assign buffer and enable
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

  return n;
}
 
// Read shader from file
function readShaderFile(gl, fileName, shader) {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status !== 404) { 
	onReadShader(gl, request.responseText, shader); 
    }
  }
  request.open('GET', fileName, true); // Create a request to acquire the file
  request.send();                      // Send the request
}

// The shader is loaded from file
function onReadShader(gl, fileString, shader) {
  if (shader == 'v') { // Vertex shader
    VSHADER_SOURCE = fileString;
  } else 
  if (shader == 'f') { // Fragment shader
    FSHADER_SOURCE = fileString;
  }
  // When both are available, call start().
  if (VSHADER_SOURCE && FSHADER_SOURCE) start(gl);
}

