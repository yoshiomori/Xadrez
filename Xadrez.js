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
    
    // Ler os arquivos de Shader
    
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    	console.log('Failed to intialize shaders.');
    	return;
    }
    
    // Dado o pgn variável string do arquvo .pgn carregado do html
    	// Criar uma fila dos movimentos{tipo peça, posição inicial, posição final, ...}
            // parser do pgn
    
    // Inicializar hashmap dos objetos{chave=posição, valor=objeto}
       // Carregar bispo
          // Ler arquivo
          // Parser
             // return bispo{tipo de peça, posição}
       // Caregar cavalo
       // ...
       
    // Carregar tabuleiro

    // Start drawing
    var tick = function() {
    	// Update Args das operações
    	
    	   // Ler evento de movimento do mouse
    	   
    	   	// Atualizar argumento de Rotação
    	   	
    	   	// Atualizar argumento de Scale
    	   // Pop do movimento
    	   
    	   	// Atualizar argumento da posição
    	   	
    	// Loop para cada peça
    	
    	   // Draw the triangle
    	
    	// Request that the browser ?calls tick
    	requestAnimationFrame(tick, canvas);
    };
    tick()
}
