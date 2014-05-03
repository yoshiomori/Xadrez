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
function obj_mov(acao, jog){
	var m = new Mov(jog);
	// Separa as duas strings do "-". 
	// Assim, a primeira string é a posição inicial e a segunda a final
	var movs = acao.split("-");
	m.x_init = valorx(movs[0][0]);
	m.y_init = movs[0][1];
	
	// Caso tenha + e #, retira, pois não é útil ao nosso trabalho
	// Caso tenha um caracter, será um movimento de pawn promotion
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
	this.id = null;   // Id da peça = {P, K, N, Q, B, R}
	this.jogador = jog;  // {W, B}
	this.px_init = 0;   // Posição da coluna onde está a peça
	this.py_init = 0;	// Posição da linha onde está a peça
	this.px_fim = 0;	// Posição da coluna onde a peça se moverá
	this.py_fim = 0;	// Posição da linha onde a peça se moverá
	this.morto = false;	// Informação se foi capturado
	this.mod = false;	// Um auxiliar que nos indica se houve alguma mudança da peça na jogada
}

// Função que inicia as peças com seus respectivos lugares iniciais
function iniciaPecas(jog){
	var pecas = [];
	// Para os peões
	for(var i = 1; i <= 8 ; i++){
		var p = new Peca(jog);
		p.id = 'P';
		p.px_init = i; 
		if(jog == 'W')
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
		if(jog == 'W')
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

// Função que recebe a jogada e as peças do jogador que não vai se mover na jogada
// Assim, poderemos saber se o jogador da jogada capturou uma peça do adversário
function kill(pecas, play){
	for(var i = 0; i < pecas.length; i++){
		// Para que não faça a animação da rodada anterior, pois o jogador
		// dessas peças não moverá
		pecas[i].px_init = pecas[i].px_fim;
		pecas[i].py_init = pecas[i].py_fim;
		pecas[i].mod = false;
	}
	//Caso de captura no en passant
	for(var i = 0; i < pecas.length; i++){
		if(pecas[i].id == 'P' && pecas[i].jogador == 'W' &&
				pecas[i].py_fim == 4 && (play.x_init == pecas[i].px_fim - 1 ||
				play.x_init == pecas[i].px_fim + 1) && play.y_init == 4 &&
				play.x_fim == pecas[i].px_fim && play.y_fim == 3){
			pecas[i].morto = true;
			pecas[i].mod = true;
			return pecas;
		}
		else if(pecas[i].id == 'P' && pecas[i].jogador == 'B' &&
				pecas[i].py_fim == 5 && (play.x_init == pecas[i].px_fim - 1 ||
				play.x_init == pecas[i].px_fim + 1) && play.y_init == 5 &&
				play.x_fim == pecas[i].px_fim && play.y_fim == 6){
			pecas[i].morto = true;
			pecas[i].mod = true;
			return pecas;
		}
	}
	// Caso de captura normal
	for(var i = 0; i < pecas.length; i++){
		if(pecas[i].px_fim == play.x_fim && pecas[i].py_fim == play.y_fim){
			pecas[i].morto = true;
			pecas[i].mod = true;
			break;
		}
	}
	return pecas;
}

// Função que realiza o movimento e retorna as peças atuaizadas
function mover(pecas, play){
	for(var i = 0; i < pecas.length; i++){
		pecas[i].mod = false;
		// Se houve captura na jogada passada, retira a peça, pois ela
		// não tem mais utiidade no jogo
		if(pecas[i].morto){
			pecas.splice(i, 1);
			i--;
		}
	}
	// Verifica qual peça a ser mudada e atualiza as posições
	for(var i = 0; i < pecas.length; i++){
		if(pecas[i].px_init == play.x_init && pecas[i].py_init == play.y_init){
			// Pawn promotion
			if(play.promotion != null)
				pecas[i].id = play.promotion;
			// Kingside castling (a torre também moverá)
			else if((play.x_init == 5 && play.y_init == 8 &&
					play.x_fim == 7 && play.y_fim == 8) ||
					(play.x_init == 5 && play.y_init == 1 &&
					play.x_fim == 7 && play.y_fim == 1)){
	
				for(var j = 0; !(pecas[j].px_init == 8 && 
				pecas[j].py_init == play.y_init); j++);
				
				pecas[j].px_fim = 6;
				pecas[j].py_fim = play.y_fim;
				pecas[j].mod = true;
			}
			// Queenside castling (a torre também moverá)
			else if((play.x_init == 5 && play.y_init == 8 &&
					play.x_fim == 3 && play.y_fim == 8) ||
					(play.x_init == 5 && play.y_init == 1 &&
					play.x_fim == 3 && play.y_fim == 1)){
				
				for(var j = 0; !(pecas[j].px_init == 1 && 
				pecas[j].py_init == play.y_init); j++);
				
				pecas[j].px_fim = 4;
				pecas[j].py_fim = play.y_fim;
				pecas[j].mod = true;
			}
			// Atualiza para onde a peça irá
			pecas[i].px_fim = play.x_fim;
			pecas[i].py_fim = play.y_fim;
			pecas[i].mod = true;
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
			//Variável que guardará todas as "palavras" do texto e
			// retirará as palavras dos comentários, assim como espaços em branco
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
	
	/*//Teste para ver cada atributo de cada movimento
	for(var f = 0; f < plays.length; f++){
		alert(plays[f].x_init + " " + plays[f].y_init  + " " +
		plays[f].jogador + " " + plays[f].x_fim  + " " + plays[f].y_fim + " " + plays[f].promotion);
	}*/
	//Teste mostrando cada movimento em uma matriz que representa o tabuleiro 
	  // Uma espécie de simulação via matriz
	var pecasW = [];
	var pecasB = [];
	var print = new Array(9);
	for(var i = 0 ; i < 9; i++){
		print[i] = new Array(9);
	}
	print[8][1] = 'A'; print[0][0] = "1 - ";
	print[8][2] = 'B'; print[1][0] = "2 - ";
	print[8][3] = 'C'; print[2][0] = "3 - ";
	print[8][4] = 'D'; print[3][0] = "4 - ";
	print[8][5] = 'E'; print[4][0] = "5 - ";
	print[8][6] = 'F'; print[5][0] = "6 - ";
	print[8][7] = 'G'; print[6][0] = "7 - ";
	print[8][8] = 'H'; print[7][0] = "8 - ";
	print[8][0] = 'X - ';
	pecasW = iniciaPecas('W');
	pecasB = iniciaPecas('B');
	for(var i = 0; i < plays.length; i++){
		for(var j = 0; j < 8; j++){
			for(var l = 1; l < 9; l++){
				print[j][l] = 'O';
			}
		}
		if(plays[i].jogador == 'W'){
			pecasW = mover(pecasW, plays[i]);
			pecasB = kill(pecasB, plays[i]);
		}
		else{
			pecasW = kill(pecasW, plays[i]);
			pecasB = mover(pecasB, plays[i]);
		}
		for(var j = 0; j < pecasW.length; j++)
			print[pecasW[j].py_fim - 1][pecasW[j].px_fim] = pecasW[j].id;
		for(var l = 0; l < pecasB.length; l++)
			print[pecasB[l].py_fim - 1][pecasB[l].px_fim] = pecasB[l].id;
		
		alert(print.join('\n'));
	}

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

	// add spotlight
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-30, 40, 50);
	spotLight.intensity = 1;
	scene.add(spotLight);
	
	// add spotlight
	var spotLight2 = new THREE.SpotLight(0xffffff);
	spotLight2.position.set(30, 40, -50);
	spotLight2.intensity = 1;
	scene.add(spotLight2);

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
	
	var pieces = new Array();
	var type = {
			'bispo':null,
			'cavalo':null,
			'peao':null,
			'rainha':null,
			'rei':null,
			'torre':null
	};
	type.white = new THREE.MeshLambertMaterial({
		color : 0xffffff
	});
	type.black = new THREE.MeshLambertMaterial({
		color : 0x444444
	});
	// Cria nova peça tipo pode ser bispo, cavalo, peao, rainha, rei e torre e a cor pode ser branco ou preto
	type.nova_peça = function (tipo, cor){
		geometry = this[tipo].clone();
		geometry.children.forEach(function(child) {
			if (child.children.length == 1) {
				if (child.children[0] instanceof THREE.Mesh) {
					if(cor == "branco"){
						child.children[0].material = type.white;
					}
					else{
						child.children[0].material = type.black;
					}
				}
			}
		});
		return geometry;
	};
	// Carregando Bispo
	var loader = new THREE.OBJLoader();
	loader.load('objetos/bispo.obj', function(geometry) {
		geometry.scale.set(5, 5, 5);
		geometry.name = "bispo";
		type['bispo'] = geometry;
		
		// Jogador Branco
		// Peça 1
		geometry = type.nova_peça('bispo', 'branco');
		geometry.rotation.y = Math.PI / 2;
		geometry.position.set(-6,0,14);
		pieces.push(geometry);
		scene.add(geometry);
		// Peça 2
		geometry = type.nova_peça('bispo', 'branco');
		geometry.rotation.y = Math.PI / 2;
		geometry.position.set(6,0,14);
		pieces.push(geometry);
		scene.add(geometry);
		
		// Jogador Preto
		// Peça 1
		geometry = type.nova_peça('bispo', 'preto');
		geometry.rotation.y = Math.PI * 3 / 2;
		geometry.position.set(-6,0,-14);
		pieces.push(geometry);
		scene.add(geometry);
		// Peça 2
		geometry = type.nova_peça('bispo', 'preto');
		geometry.rotation.y = Math.PI * 3 / 2;
		geometry.position.set(6,0,-14);
		pieces.push(geometry);
		scene.add(geometry);
	});
	// Carregando Cavalo
	loader.load('objetos/cavalo.obj', function(geometry) {
		geometry.scale.set(5, 5, 5);
		geometry.name = "cavalo";
		type['cavalo'] = geometry;
		
		// Jogador Branco
		// Peça 1
		geometry = type.nova_peça('cavalo', 'branco');
		geometry.rotation.y = - Math.PI / 2;
		geometry.position.set(-10,0,14);
		pieces.push(geometry);
		scene.add(geometry);
		// Peça 2
		geometry = type.nova_peça('cavalo', 'branco');
		geometry.rotation.y = - Math.PI / 2;
		geometry.position.set(10,0,14);
		pieces.push(geometry);
		scene.add(geometry);
		
		// Jogador Preto
		// Peça 1
		geometry = type.nova_peça('cavalo', 'preto');
		geometry.rotation.y = - Math.PI * 3 / 2;
		geometry.position.set(-10,0,-14);
		pieces.push(geometry);
		scene.add(geometry);
		// Peça 2
		geometry = type.nova_peça('cavalo', 'preto');
		geometry.rotation.y = - Math.PI * 3 / 2;
		geometry.position.set(10,0,-14);
		pieces.push(geometry);
		scene.add(geometry);
	});
	// Carregando Peao
	loader.load('objetos/peao.obj', function(geometry) {
		geometry.scale.set(5, 5, 5);
		geometry.name = "peao";
		type['peao'] = geometry;
		
		// Jogador Branco
		for(var i = 0; i < 8; i++){
			geometry = type.nova_peça('peao', 'branco');
			geometry.position.set(-14 + i*4, 0, 10);
			pieces.push(geometry);
			scene.add(geometry);
		}
		
		// Jogador Preto
		for(var i = 0; i < 8; i++){
			geometry = type.nova_peça('peao', 'preto');
			geometry.position.set(-14 + i*4, 0, -10);
			pieces.push(geometry);
			scene.add(geometry);
		}
	});
	// Carregando Rainha
	loader.load('objetos/rainha.obj', function(geometry) {
		geometry.scale.set(5, 5, 5);
		geometry.name = "rainha";
		type['rainha'] = geometry;

		// Jogador Branco
		geometry = type.nova_peça('rainha', 'branco');
		geometry.scale.set(5, 5, 5);
		geometry.position.set(2,0,14);
		pieces.push(geometry);
		scene.add(geometry);
		
		// Jogador preto
		geometry = type.nova_peça('rainha', 'preto');
		geometry.scale.set(5, 5, 5);
		geometry.position.set(-2,0,-14);
		pieces.push(geometry);
		scene.add(geometry);
	});
	// Carregando Rei
	loader.load('objetos/rei.obj', function(geometry) {
		geometry.scale.set(5, 5, 5);
		geometry.name = "rei";
		type['rei'] = geometry;

		// Jogador Branco
		geometry = type.nova_peça('rei', 'branco');
		geometry.scale.set(5, 5, 5);
		geometry.position.set(-2,0,14);
		pieces.push(geometry);
		scene.add(geometry);
		
		// Jogador preto
		geometry = type.nova_peça('rei', 'preto');
		geometry.scale.set(5, 5, 5);
		geometry.position.set(2,0,-14);
		pieces.push(geometry);
		scene.add(geometry);
	});
	// Carregando Torre
	loader.load('objetos/torre.obj', function(geometry) {
		geometry.scale.set(5, 5, 5);
		geometry.name = "torre";
		type['torre'] = geometry;
		
		// Jogador Branco
		// Peça 1
		geometry = type.nova_peça('torre', 'branco');
		geometry.position.set(-14,0,14);
		pieces.push(geometry);
		scene.add(geometry);
		// Peça 2
		geometry = type.nova_peça('torre', 'branco');
		geometry.position.set(14,0,14);
		pieces.push(geometry);
		scene.add(geometry);
		
		// Jogador Preto
		// Peça 1
		geometry = type.nova_peça('torre', 'preto');
		geometry.position.set(-14,0,-14);
		pieces.push(geometry);
		scene.add(geometry);
		// Peça 2
		geometry = type.nova_peça('torre', 'preto');
		geometry.position.set(14,0,-14);
		pieces.push(geometry);
		scene.add(geometry);
	});
	
	var loader = new THREE.OBJMTLLoader();
    loader.addEventListener('load', function (event) {

        var object = event.content;

        object.scale.set(2, 2, 2);
        scene.add(object);
    });


    loader.load('objetos/tabuleiro.obj', 'objetos/tabuleiro.mtl', {side: THREE.DoubleSide});

	render();
	
	/*var pecasW = [];
	var pecasB = [];
	pecasW = iniciaPecas('W');
	pecasB = iniciaPecas('B');
	var pecas = pecasW.concat(pecasB);
	var i = 0; */
	
	var t = true;
	var move_list = new Array();

	function render() {

		// Ler evento de movimento do mouse
		var delta = clock.getDelta();
		trackballControls.update(delta);
		
		/*if(t){ // Verificando se as peças jã se movimentaram, para pegar a proxima jogada.
		if(i < plays.length){
			if(plays[i].jogador == 'W'){
				pecasW = mover(pecasW, plays[i]);
				pecasB = kill(pecasB, plays[i]);
			}
			else{
				pecasW = kill(pecasW, plays[i]);
				pecasB = mover(pecasB, plays[i]);
			}
			pecas = pecasW.concat(pecasB);
			i++;
		}
	}*/
		
		// Pop do movimento
		if(t){
			// TODO: Atualizar argumento da posição
			move_list; //Concatenar pecaW pecaB
			t = false;
		}
		// Jogo começa depois de todas as peças carregadas
		if(pieces.length == 32){
			while(move_list.length){
				move = move_list.pop();
				console.log(move);
			}
		}


		// render using requestAnimationFrame
		requestAnimationFrame(render);
		webGLRenderer.render(scene, camera);
	}
}
