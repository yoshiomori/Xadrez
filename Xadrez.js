//Simulando uma classe em javascript. 
//Essa classe conterá os atributos de cada jogada
function Mov (jog) {
    this.x_init = 0;	    // Movimento coluna (a, b, ..., h)
    this.y_init = 0;		// Movimento linha (1, ..., 8)
    this.jogador = jog;		// Jogador da jogada (B = preto, W = branco)
    this.x_fim = 0;	// Se houver conflito entre duas peças, qual coluna está a peça que deverá se mover
    this.y_fim = 0;	// Se continuar com conflito, qual linha está a peça que deverá se mover
    this.promotion = null  // Se houver pawn promotion, para que peça se tranformará
}

// Função que transforma coluna em um inteiro onde (a, b, ..., h) = (1, 2, ..., 8)
function valorx(coluna){
	if(coluna === 'a') return 1;
	else if(coluna === 'b') return 2;
	else if(coluna === 'c') return 3;
	else if(coluna === 'd') return 4;
	else if(coluna === 'e') return 5;
	else if(coluna === 'f') return 6;
	else if(coluna === 'g') return 7;
	else 					return 8;
}

// Função auxiliar que troca de jogador para cada jogada
function changeJ(jogador){
	if(jogador == 'W') return 'B';
	else 			   return 'W';
}

// função que recebe a jogada e forma um objeto jogada com os atributos corretos
// Ela lê a jogada codificada de traz para frente e cortando o que já foi codificado
function obj_mov(acao, jog){
	var m = new Mov(jog);
	var movs = acao.split("-");
	m.x_init = valorx(movs[0][0]);
	m.y_init = movs[0][1];
	
	if(movs[1].length == 3){
		if(movs[1][2] == '+' || movs[1][2] == '#')
			movs[1] = movs[1].slice(0, 2);	
		else{
			m.promotion = movs[1][2];
			movs[1] = movs[1].slice(0, 2);	
		}
	}
	
	m.x_fim = valorx(movs[1][0]);
	m.y_fim = movs[1][1];
	return m;
}

//Essa classe conterá os atributos de cada peca do jogo
function Peca(jog){
	this.id = null;
	this.jogador = jog;
	this.px_init = 0;
	this.py_init = 0;
	this.px_fim = 0;
	this.py_fim = 0;
	this.morto = false;
}

// Função que inicia as peças com seus respectivos lugares iniciais
function iniciaPecas(jog){
	var pecas = [];
	// Para os peões
	for(var i = 1; i <= 8 ; i++){
		var p = new Peca(jog);
		p.id = 'P';
		p.px_init = i; 
		if(jog = 'W')
			p.py_init = 2;
		else
			p.py_init = 7;
		p.px_fim = p.px_init;
		p.py_fim = p.py_init;
		pecas.push(p);
	}
	
	// Para as restantes:
	// Foi feito dessa maneira para que as peças iguais sejam adjacentes no vetor
	for(var i = 1; i <= 8 ; i++){
		var p = new Peca(jog);
		p.px_init = i; 
		if(jog = 'W')
			p.py_init = 1;
		else
			p.py_init = 8;
		p.px_fim = p.px_init;
		p.py_fim = p.py_init;
		pecas.push(p);
	}
	// Denominando o id para cada peça
	pecas[8].id = 'R';  pecas[15].id = 'R';
	pecas[9].id = 'N';  pecas[14].id = 'N';
	pecas[10].id = 'B'; pecas[13].id = 'B';
	pecas[11].id = 'Q'; pecas[12].id = 'K';
	return pecas;
}

function kill(pecas, play){
	for(var i = 0; i < pecas.length; i++){
		// Para que não faça a animação da rodada anterior
		pecas[i].px_init = pecas[i].px_fim;
		pecas[i].py_init = pecas[i].py_fim;
	}
	// en passant
	for(var i = 0; i < pecas.length; i++){
		if(pecas[i].id == 'P' && pecas[i].jogador = 'W' &&
				pecas[i].py_fim == 4 && (play.x_init == pecas[i].px_fim - 1 ||
				play.x_init == pecas[i].px_fim + 1) && play.py_init == 4 &&
				play.x_fim == pecas[i].px_fim && play.y_fim == 3){
			pecas[i].morto = true;
			return pecas;
		}
		else if(pecas[i].id == 'P' && pecas[i].jogador = 'B' &&
				pecas[i].py_fim == 5 && (play.x_init == pecas[i].px_fim - 1 ||
				play.x_init == pecas[i].px_fim + 1) && play.py_init == 5 &&
				play.x_fim == pecas[i].px_fim && play.y_fim == 6){
			pecas[i].morto = true;
			return pecas;
		}
	}
	for(var i = 0; i < pecas.length; i++){
		if(pecas[i].px_fim == play.x_fim && pecas[i].py_fim == play.y_fim){
			pecas[i].morto = true;
			break;
		}
	}
	return pecas;
}

// Função que realiza o movimento e retorna as peças atuaizadas
function mover(pecas, play){
	for(var i = 0; i < pecas.length; i++){
		// Se houve captura na jogada passada, retira a peça
		if(pecas[i].killed){
			pecas = pecas.splice(i, 1);
			i--;
		}
		// Atualiza a posição anterior pela atual
	}
	// Verifica qual peça a ser mudada e atualiza as posições
	for(var i = 0; i < pecas.length; i++){
		if(pecas[i].px_init == play.x_init && pecas[i].py_init == play.y_init){
			// Pawn promotion
			if(play.promotion != null)
				pecas[i].id = pay.promotion;
			// Kingside castling
			else if((play.x_init == 5 && play.y_init == 8 &&
					play.x_fim == 7 && play.y_fim == 8) ||
					(play.x_init == 5 && play.y_init == 1 &&
					play.x_fim == 7 && play.y_fim == 1)){
	
				for(var j = 0; !(pecas[j].px_init == 8 && 
				pecas[j].py_init == play.y_init); j++);
				pecas[j].px_fim == 6;
				pecas[i].py_fim == play.y_fim;
			}
			// Queenside castling
			else if((play.x_init == 5 && play.y_init == 8 &&
					play.x_fim == 3 && play.y_fim == 8) ||
					(play.x_init == 5 && play.y_init == 1 &&
					play.x_fim == 3 && play.y_fim == 1)){
				for(var j = 0; !(pecas[j].px_init == 1 && 
				pecas[j].py_init == play.y_init); j++);
				pecas[j].px_fim == 4;
				pecas[i].py_fim == play.y_fim;
			}
			pecas[i].px_fim == play.x_fim;
			pecas[i].py_fim == play.y_fim;
			break;
		}
	}
	return pecas;
}


// Função que é iniciada no carregamento da página
function init() {
	checkForFileApiSupport();
	document.getElementById('file').addEventListener('change', handleFileSelect, false);
}

// Verifica se há suporte ao File API
function checkForFileApiSupport() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // All the File APIs are supported.
    }
    else {
     alert('The File APIs are not fully supported in this browser.');
    }
}

// Função que trata o evento de seleção de arquivo
function handleFileSelect(evt) {
	var f = evt.target.files[0];
	
	// Verifica se é um arquivo pgn
	if (!f.type.match('x-chess-pgn.*')) {
		alert('Only .PGN files');
	}
	else{
		var reader = new FileReader();
		document.getElementById("form").style.position = 'absolute';	
		document.getElementById('form').style.visibility = 'hidden';
		// Trata o evento de leitura
		reader.onload = function(e) {
		if (e.target.readyState == FileReader.DONE) // DONE == 2
			// Separa cada linha do texto
			var str = reader.result.split("\n");
			// Retira as informações do jogo. O que estão entre [...]
			for(var i = 0; i < str.length; i++){
				var bracket = /^(\[)/;
				var empty_line = /^\s*$/;
				if(bracket.test(str[i]) || empty_line.test(str[i])){
					str.splice(i,1);
					i--;
				}
			}
			//Variável que guardará todas as "palavras" do texto
			var al_words = new Array();
			var comment_nextline = false;
			for(var i = 0; i < str.length; i++){
				var words = str[i].split(/[" "]+/);
				var comment1 = /^(\;)/;
				var comment2 = /^(\{)/;
				var comment3 = /(\})$/;
				var nalphanum = /(\W)$/;
				// Retira os comentários. O que há depois de ; ou entre {}
				for(var j = 0; j < words.length; j++){
					if(comment_nextline){
						comment_nextline = false;
						for(var k = 0; !comment3.test(words[k]); k++){
							if(k == (words.length - 1)){
								comment_nextline = true;
								break;
							}
						}
						words.splice(0, (k + 1));
						j--;
					}
					else{
						if(comment1.test(words[j])){
							words.splice(j, (words.length - j));
							break;
						}
						if(comment2.test(words[j])){
							for(var k = j; !comment3.test(words[k]); k++){
								if(k == (words.length - 1)){
									comment_nextline = true;
									break;
								}
							}
							words.splice(j, (k - j + 1));
							j--;
						}
						else if(words[j][words[j].length - 1] != '+' &&
								words[j][words[j].length - 1] != '#' &&
								words[j][words[j].length - 1] != '.' &&
								words[j][words[j].length - 1] != '-' &&
								nalphanum.test(words[j]))
							words[j] = words[j].slice(0, words[j].length - 1);
					}
				}
				al_words = al_words.concat(words);
			}
			// Retira a última palavra, pois é o resultado do jogo. Ex: 1-0
			al_words.splice(al_words.length - 1, 1); 
			// Vetor que guardará todos os objetos jogadas. Está na ordem 
			// de jogada, ou seja, o indíce 0 é a primeira jogada, 1 a segunda, etc.
			var movs = [];
			// Iniciar o jogador como W(branco), por convenção
			var jog = 'W';
			// Para cada palavra, extrai a jogada codificada e a tranforma em um objeto jogada
			for(var i = 0; i < al_words.length; i++){
				// Caso a palavra seja o indíce da rodada
				if(al_words[i].search(/\./) != -1){
					// Se o arquivo pgn, a primeira jogada da rodada vier junto do indíce. Ex: 2.e5
					if(al_words[i][al_words[i].length - 1] != '.'){
						// Separa a do indíce
						var aux = al_words[i].split(/\./);
						var m = obj_mov(aux[1], jog);
						movs.push(m);
						// Vez do próximo jogador
						jog = changeJ(jog);
					}
				}
				// Se não for o indíce da rodada
				else{
					var m = obj_mov(al_words[i], jog);
					movs.push(m);
					// Vez do próximo jogador
					jog = changeJ(jog);
				}
			}
			// Quando todas as jogadas foram traduzidas para o vetor movs, 
			// chamaremos a função que inicia a parte gráfica
			main(movs);
		}
		reader.readAsText(f, "UTF-8");	
	}
}


function main(plays){
	var clock = new THREE.Clock();
	
	//Teste
	/*for(var f = 0; f < plays.length; f++){
		alert(plays[f].x_init + " " + plays[f].y_init  + " " +
		plays[f].jogador + " " + plays[f].x_fim  + " " + plays[f].y_fim + " " + plays[f].promotion);
	}*/
	var tab = [["O","O","O","O","O","O","O","O"],["O","O","O","O","O","O","O","O"],
	           ["O","O","O","O","O","O","O","O"],["O","O","O","O","O","O","O","O"],
	           ["O","O","O","O","O","O","O","O"],["O","O","O","O","O","O","O","O"],
	           ["O","O","O","O","O","O","O","O"],["O","O","O","O","O","O","O","O"]];
	var print = tab;
	var pecasW = [];
	var pecasB = [];
	pecasW = iniciaPecas('W');
	pecasB = iniciaPecas('B');
	for(var i = 0; i < plays.length; i++){
		print = tab;
		if(plays[i].jogador == 'W'){
			pecasW = mover(pecasW, plays[i]);
		//	pecasB = kill(pecasB, plays[i]);
		}
		else{
			//pecasW = kill(pecasW, plays[i]);
			pecasB = mover(pecasB, plays[i]);
		}
		for(var j = 0; j < pecasW.length; j++)
			print[pecasW[j].py_fim - 1][pecasW[j].px_fim - 1] = pecasW[j].id;
		for(var l = 0; l < pecasB.length; l++)
			print[pecasB[l].py_fim - 1][pecasB[l].px_fim - 1] = pecasB[l].id;
		alert(print.join('\n'));
	}

	// Fim dos testes
	// once everything is loaded, we run our Three.js stuff.

	// create a scene, that will hold all our elements such as objects, cameras
	// and lights.
	var scene = new THREE.Scene();

	// create a camera, which defines where we're looking at.
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth
			/ window.innerHeight, 0.1, 1000);

	// create a render and set the size
	var webGLRenderer = new THREE.WebGLRenderer();
	webGLRenderer.setClearColor(0x888888, 1.0);
	webGLRenderer.setSize(window.innerWidth, window.innerHeight);
	webGLRenderer.shadowMapEnabled = true;

	// position and point the camera to the center of the scene
	camera.position.x = -30;
	camera.position.y = 40;
	camera.position.z = 50;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	var trackballControls = new THREE.TrackballControls(camera);
	
	trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 1.0;
    trackballControls.panSpeed = 1.0;
//    trackballControls.noZoom=false;
//    trackballControls.noPan=false;
    trackballControls.staticMoving = true;
//    trackballControls.dynamicDampingFactor=0.3;

	// add spotlight for the shadows
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-30, 40, 50);
	spotLight.intensity = 1;
	scene.add(spotLight);

	// add the output of the renderer to the html element
	$("#WebGL-output").append(webGLRenderer.domElement);

	// TODO: Dado o pgn variável string do arquvo .pgn carregado do html
	// TODO: Criar uma fila{Classe da peça['b','n','p','q','k','r'], movx[int],movy[int], jogador['b'|'w'], "comeu"[bool], conflx[int], confly[int]}
	// TODO: parser do pgn
	
	// TODO: Criar Tabuleiro
	// TODO: Carregar tabuleiro

	// TODO: Criar peças do jogo (posição(int int), jogador,status) Funções(in(Classe da peça, movimento)out(peça))
	// TODO: Inicializar hashmap dos objetos{chave="nome do objeto", valor=objeto}
	// TODO: Carregar bispo
	// TODO: Ler arquivo
	// TODO: Parser
	// TODO: return bispo{tipo de peça, posição}
	// TODO: Caregar cavalo
	// TODO: ...

	// call the render function
	var step = 0;
	
	var objects = {
		'bispo': null,
		'cavalo': null,
		'peao': null,
		'rainha': null,
		'rei': null,
		'torre': null,
		'tabuleiro': null
	};
	
	var loader = new THREE.OBJLoader();
	loader.load('objetos/bispo.obj', function(geometry) {
		var material = new THREE.MeshLambertMaterial({
			color : 0xffffff
		});

		// geometry is a group of children. If a child has one additional
		// child
		// it's probably a mesh
		geometry.children.forEach(function(child) {
			if (child.children.length == 1) {
				if (child.children[0] instanceof THREE.Mesh) {
					child.children[0].material = material;
				}
			}
		});

		objects['bispo'] = geometry;
		geometry.scale.set(5, 5, 5);
		geometry.position.x = -9;
		scene.add(geometry);
	});
	
	loader.load('objetos/cavalo.obj', function(geometry) {
		var material = new THREE.MeshLambertMaterial({
			color : 0xffffff
		});

		// geometry is a group of children. If a child has one additional
		// child
		// it's probably a mesh
		geometry.children.forEach(function(child) {
			if (child.children.length == 1) {
				if (child.children[0] instanceof THREE.Mesh) {
					child.children[0].material = material;
				}
			}
		});

		objects['cavalo'] = geometry;
		geometry.scale.set(5, 5, 5);
		geometry.position.x = -6;
		scene.add(geometry);
	});
	
	loader.load('objetos/peao.obj', function(geometry) {
		var material = new THREE.MeshLambertMaterial({
			color : 0xffffff
		});

		// geometry is a group of children. If a child has one additional
		// child
		// it's probably a mesh
		geometry.children.forEach(function(child) {
			if (child.children.length == 1) {
				if (child.children[0] instanceof THREE.Mesh) {
					child.children[0].material = material;
				}
			}
		});

		objects['peao'] = geometry;
		geometry.scale.set(5, 5, 5);
		geometry.position.x = -3;
		scene.add(geometry);
	});
	
	loader.load('objetos/rainha.obj', function(geometry) {
		var material = new THREE.MeshLambertMaterial({
			color : 0xffffff
		});

		// geometry is a group of children. If a child has one additional
		// child
		// it's probably a mesh
		geometry.children.forEach(function(child) {
			if (child.children.length == 1) {
				if (child.children[0] instanceof THREE.Mesh) {
					child.children[0].material = material;
				}
			}
		});

		objects['rainha'] = geometry;
		geometry.scale.set(5, 5, 5);
		geometry.position.x = 0;
		scene.add(geometry);
	});
	
	loader.load('objetos/rei.obj', function(geometry) {
		var material = new THREE.MeshLambertMaterial({
			color : 0xffffff
		});

		// geometry is a group of children. If a child has one additional
		// child
		// it's probably a mesh
		geometry.children.forEach(function(child) {
			if (child.children.length == 1) {
				if (child.children[0] instanceof THREE.Mesh) {
					child.children[0].material = material;
				}
			}
		});

		objects['rei'] = geometry;
		geometry.scale.set(5, 5, 5);
		geometry.position.x = 3;
		scene.add(geometry);
	});
	
	loader.load('objetos/torre.obj', function(geometry) {
		var material = new THREE.MeshLambertMaterial({
			color : 0xffffff
		});

		// geometry is a group of children. If a child has one additional
		// child
		// it's probably a mesh
		geometry.children.forEach(function(child) {
			if (child.children.length == 1) {
				if (child.children[0] instanceof THREE.Mesh) {
					child.children[0].material = material;
				}
			}
		});

		objects['torre'] = geometry;
		geometry.scale.set(5, 5, 5);
		geometry.position.x = 6;
		scene.add(geometry);
	});
	
	var loader = new THREE.OBJMTLLoader();
    loader.addEventListener('load', function (event) {

        var object = event.content;

        object.scale.set(2, 2, 2);
        objects['tabuleiro'] = object;
        scene.add(objects['tabuleiro']);
    });


    loader.load('objetos/tabuleiro.obj', 'objetos/tabuleiro.mtl', {side: THREE.DoubleSide});

	render();
	
	var t = true;

	function render() {
		// TODO: Update Args das operações

		// TODO:Ler evento de movimenTODO mouse
		var delta = clock.getDelta();
		trackballControls.update(delta);

		// TODO: Atualizar argumento de Rotação

		// TODO: Atualizar argumento de Scale
		// TODO: Pop do movimento

		// TODO: Atualizar argumento da posição

		// Loop para cada peça
		for(object in objects){
			if(objects[object]){
				//objects[object].rotation.x += 0.006;
			}
		}


		// render using requestAnimationFrame
		requestAnimationFrame(render);
		webGLRenderer.render(scene, camera);
	}
}
