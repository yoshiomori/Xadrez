//Simulando uma classe em javascript. 
//Essa classe conterá os atributos de cada jogada
function Mov (jog) {
	this.peca = null;   // Peça do movimento
	this.movx = 0;	    // Movimento coluna (a, b, ..., h)
	this.movy = 0;		// Movimento linha (1, ..., 8)
	this.jogador = jog;		// Jogador da jogada (B = preto, W = branco)
	this.kill = false;		// Se essa jogada haverá captura de peça adversária
	this.conflx = 0;	// Se houver conflito entre duas peças, qual coluna está a peça que deverá se mover
	this.confly = 0;	// Se continuar com conflito, qual linha está a peça que deverá se mover
	this.promotion = null;	  // Se houver pawn promotion, para que peça se tranformará
}

//Função que transforma coluna em um inteiro onde (a, b, ..., h) = (1, 2, ..., 8)
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

//Função auxiliar que troca de jogador para cada jogada
function changeJ(jogador){
	if(jogador == 'W') return 'B';
	else 			   return 'W';
}

//Função que forma as jogadas do castling
//side = kingside ou queenside, jog = B, W
function castling(side, jog){
	var movs = [];
	m1 = new Mov(jog);
	m1.peca = 'K';
	m2 = new Mov(jog);
	m2.peca = 'R';
	if(side == "O-O"){
		m1.movx = valorx('g');
		m2.movx = valorx('f');
		m2.conflx = valorx('h');	
		if(jog == 'W'){
			m1.movy = 1;
			m2.movy = 1;
		}
		else{
			m1.movy = 8;
			m2.movy = 8;
		}
	}
	else{
		m1.movx = valorx('c');
		m2.movx = valorx('d');
		m2.conflx = valorx('a');	
		if(jog == 'W'){
			m1.movy = 1;
			m2.movy = 1;
		}
		else{
			m1.movy = 8;
			m2.movy = 8;
		}
	}
	movs.push(m1);
	movs.push(m2);
	return movs;
}

//função que recebe a jogada e forma um objeto jogada com os atributos corretos
//Ela lê a jogada codificada de traz para frente e cortando o que já foi codificado
function obj_mov(acao, jog){
	var m = new Mov(jog);
	if(acao[acao.length - 1] == '+' || acao[acao.length - 1] == '#')
		acao = acao.slice(0, acao.length - 1);

	if(acao[acao.length - 1] == 'K'|| acao[acao.length - 1] == 'Q' || acao[acao.length - 1] == 'R' || acao[acao.length - 1] == 'B' || acao[acao.length - 1] == 'N'){
		m.promotion = acao[acao.length - 1];
		acao = acao.slice(0, acao.length - 2);
	}

	m.movy = acao[acao.length - 1];
	m.movx = valorx(acao[acao.length - 2]);
	acao = acao.slice(0, acao.length - 2);

	if(acao.length <= 0) 
		m.peca = 'P';
	else{
		if(acao[acao.length - 1] == 'x'){
			m.kill = true;
			acao = acao.slice(0, acao.length - 1);
		}

		if(acao.length <= 0) 
			m.peca = 'P';
		else if(acao.length == 1){
			if(acao[0] == 'K'|| acao[0] == 'Q' || acao[0] == 'R' || acao[0] == 'B' || acao[0] == 'N')
				m.peca = acao[0];
			else{
				m.peca = 'P';
				m.conflx = valorx(acao);
			}
		}
		else if(acao.length == 2){
			if(acao[0] == 'K'|| acao[0] == 'Q' || acao[0] == 'R' || acao[0] == 'B' || acao[0] == 'N'){
				m.peca = acao[0];
				m.conflx = valorx(acao[1]);
			}
			else{
				m.peca = 'P';
				m.conflx = valorx(acao[0]);
				m.confly = acao[1];
			}
		}
		else{
			m.peca = acao[0];
			m.conflx = valorx(acao[1]);
			m.confly = acao[2];
		}
	}
	return m;
}

//Função que é iniciada no carregamento da página
function init() {
	checkForFileApiSupport();
	document.getElementById('file').addEventListener('change', handleFileSelect, false);
}

//Verifica se há suporte ao File API
function checkForFileApiSupport() {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		// All the File APIs are supported.
	}
	else {
		alert('The File APIs are not fully supported in this browser.');
	}
}

//Função que trata o evento de seleção de arquivo
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
			for(var i = 0; i < str.length; i++){
				var words = str[i].split(/[" "]+/);
				var comment1 = /^(\;)/;
				var comment2 = /^(\{)/;
				var nalphanum = /(\W)$/;
				// Retira os comentários. O que há depois de ; ou entre {}
				for(var j = 0; j < words.length; j++){
					if(comment1.test(words[j])){
						words.splice(j, (words.length - j));
						break;
					}
					if(comment2.test(words[j])){
						comment3 = /(\})$/;
						for(var k = j + 1; !comment3.test(words[k]); k++);
						words.splice(j, (k - j + 1));
						j--;
					}
					else if(words[j][words[j].length - 1] != '+' &&
							words[j][words[j].length - 1] != '#' &&
							words[j][words[j].length - 1] != '.' &&
							nalphanum.test(words[j]))
						words[j] = words[j].slice(0, words[j].length - 1);					
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
						// Verifica se é uma jogada de castling
						if(aux[1] == "O-O" || aux[1] == "O-O-O"){
							var m = castling(aux[i], jog);
							movs.push(m[0]);
							movs.push(m[1]);
						}
						// Se não, transforma em um objeto jogada
						else{
							var m = obj_mov(aux[1], jog);
							movs.push(m);
						}
						// Vez do próximo jogador
						jog = changeJ(jog);
					}

				}
				// Se não for o indíce da rodada
				else{
					// Verifica se é uma jogada de castling
					if(al_words[i] == "O-O" || al_words[i] == "O-O-O"){
						var m = castling(al_words[i], jog);
						movs.push(m[0]);
						movs.push(m[1]);
					}
					// Se não, transforma em um objeto jogada
					else{
						var m = obj_mov(al_words[i], jog);
						movs.push(m);
					}
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

	// Teste
	for(var f = 0; f < plays.length; f++){
		alert(plays[f].peca + " " + plays[f].movx + " " + plays[f].movy + " " +
				plays[f].jogador + " " + plays[f].kill + " " + plays[f].conflx + " " + plays[f].confly + plays[f].promotion);
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
//	trackballControls.noZoom=false;
//	trackballControls.noPan=false;
	trackballControls.staticMoving = true;
//	trackballControls.dynamicDampingFactor=0.3;

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

	// call the render function
	var step = 0;

	// Array de todas as peças
	var pieces = new Array();
	// Pega a peça do tipo type que está na posição positionx e positionz
	pieces.get_piece = function(positionx, positionz){
		list = this.filter(function(item, index, array){
			return (item.position.x == positionx && item.position.z == positionz);
		});
		if(list.length == 1){
			return list.pop();
		}
		alert('Erro no arquivo pgn');
		return;
	};
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
						if(tipo == 'cavalo') geometry.rotation.y = - Math.PI / 2;
						if(tipo == 'bispo') geometry.rotation.y = Math.PI / 2;
					}
					else{
						child.children[0].material = type.black;
						if(tipo == 'cavalo') geometry.rotation.y = - Math.PI * 3 / 2;
						if(tipo == 'bispo') geometry.rotation.y = Math.PI * 3 / 2;
					}
				}
			}
		});
		if(cor == "branco"){
			if(tipo == 'cavalo') geometry.rotation.y = - Math.PI / 2;
			if(tipo == 'bispo') geometry.rotation.y = Math.PI / 2;
		}
		else{
			if(tipo == 'cavalo') geometry.rotation.y = - Math.PI * 3 / 2;
			if(tipo == 'bispo') geometry.rotation.y = Math.PI * 3 / 2;
		}
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
		geometry.position.set(-6,0,14);
		pieces.push(geometry);
		scene.add(geometry);
		// Peça 2
		geometry = type.nova_peça('bispo', 'branco');
		geometry.position.set(6,0,14);
		pieces.push(geometry);
		scene.add(geometry);

		// Jogador Preto
		// Peça 1
		geometry = type.nova_peça('bispo', 'preto');
		geometry.position.set(-6,0,-14);
		pieces.push(geometry);
		scene.add(geometry);
		// Peça 2
		geometry = type.nova_peça('bispo', 'preto');
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
		geometry.position.set(-10,0,14);
		pieces.push(geometry);
		scene.add(geometry);
		// Peça 2
		geometry = type.nova_peça('cavalo', 'branco');
		geometry.position.set(10,0,14);
		pieces.push(geometry);
		scene.add(geometry);

		// Jogador Preto
		// Peça 1
		geometry = type.nova_peça('cavalo', 'preto');
		geometry.position.set(-10,0,-14);
		pieces.push(geometry);
		scene.add(geometry);
		// Peça 2
		geometry = type.nova_peça('cavalo', 'preto');
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

	// Carregando Tabuleiro
	var loader = new THREE.OBJMTLLoader();
	loader.addEventListener('load', function (event) {
		var object = event.content;
		object.scale.set(2, 2, 2);
		scene.add(object);
	});
	loader.load('objetos/tabuleiro.obj', 'objetos/tabuleiro.mtl');

	render();

	var t = true;


	function Motion(object, x, z){ // Objeto, destino(x,z)
		this.object = object;
		this.dx = (x - object.position.x)/60; // Velocidade(dx,dy,dz)
		this.dy = 8/60;
		this.dz = (z - object.position.z)/60;
		this.x = x;
		this.z = z;
		this.stage = 4;
		this.move = function(){
			switch (this.stage){
			case 0:
				var mod = 8 - this.object.position.y;
				if(mod < 0) mod *= -1;
				this.object.position.y += this.dy;
				if(mod < 0.000000001){
					this.object.position.y = 8;
					this.stage++;
				}
				break;
			case 1:
				var modx = x - this.object.position.x;
				var modz = z - this.object.position.z;
				if(modx < 0) modx *= -1;
				if(modz < 0) modz *= -1;
				this.object.position.x += this.dx;
				this.object.position.z += this.dz;
				if(modx < 0.000000001 && modz < 0.000000001) {
					this.object.position.x = x;
					this.object.position.z = z;
					this.stage++;
				}
				break;
			case 2:
				var mod = this.object.position.y;
				if(mod < 0) mod = -mod;
				this.object.position.y -= this.dy;
				if(mod < 0.000000001){
					this.object.position.y = 0;
					this.stage++;
				}
				break;
			default:
				this.stage = 4;
				break;
			}
		};
	}
	var motion;
	var motion_list = new Array();
	motion_list.done = function(){
		return this.every(function(item, index, array){
			return (item.stage == 4);
		});
	};
	motion_list.move = function(){
		this.forEach(function(item, index, array){
			item.move();
		});
	};
	
	function render() {

		// Ler evento de movimento do mouse
		var delta = clock.getDelta();
		trackballControls.update(delta);

		// Pop do movimento
		if(t){
			// TODO: Atualizar argumento da posição
			move_list = move_list.filter(function(item, index, array){
				return (item.mod);
			});
			t = false;
		}
		// Jogo começa depois de todas as peças carregadas
		if(type['bispo'] && type['torre'] && type['cavalo'] && type['peao'] && type['rainha'] && type['rei']){
			// Percorre a lista de movimentos fazendo as configurações correspondentes
			while(move_list.length){
				// Pega a peça que se movimentou
				move = move_list.pop();
				move.mod = false;
				// Ajustando ids
				switch (move.id){
				case 'P':
					move.id = 'peao';
					break;
				case 'R':
					move.id = 'torre';
					break;
				case 'N':
					move.id = 'cavalo';
					break;
				case 'B':
					move.id = 'bispo';
					break;
				case 'Q':
					move.id = 'rainha';
					break;
				case 'K':
					move.id = 'rei';
					break;
				}
				// Ajusta as coordenadas
				move.px_init = - 14 + 4 * (move.px_init - 1);
				move.py_init = 14 - 4 * (move.py_init - 1);
				move.px_final = - 14 + 4 * (move.px_final - 1);
				move.py_final = 14 - 4 * (move.py_final - 1);
				// Pega a imagem correspondente à peça
				object = pieces.get_piece(move.px_init, move.py_init);
				// Caso Peça se Moveu
				if(move.px_init != move.px_final || move.py_init != move.py_final){
					motion = new Motion(object, move.px_final, move.py_final);
					motion.stage = 0;
					motion_list.push(motion);
				}
				// Caso Peça morreu
				else if(move.morto){
					scene.remove(object);
					pieces.splice(pieces.indexOf(object),1);
				}
				// Caso Peça se transformou
				else {
					// Ajustando atributos
					if(move.jogador == 'B'){
						move.jogador = "branco";
					}
					else{
						move.jogador = "preto";
					}
					pieces.splice(pieces.indexOf(object),1);
					scene.remove(object);
					var geometry = type.nova_peça(move.id, move.jogador);
					geometry.position.x = object.position.x;
					geometry.position.z = object.position.z;
					delete object;
					object = geometry;
					pieces.push(geometry);
					scene.add(geometry);
				}
			}
			if(motion_list.done()){
				motion_list.length = 0;
				t = true;
			}
			else motion_list.move();
		}


		// render using requestAnimationFrame
		requestAnimationFrame(render);
		webGLRenderer.render(scene, camera);
	}
}
