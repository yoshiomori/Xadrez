function Mov (jog) {
    this.peca = null;
    this.movx = 0;
    this.movy = 0;
    this.jogador = jog;
    this.kill = false;
    this.conflx = 0;
    this.confly = 0;
}

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

function changeJ(jogador){
	if(jogador == 'W') return 'B';
	else 			   return 'W';
}

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
function obj_mov(acao, jog){
	var m = new Mov(jog);
	if(acao[acao.length - 1] == '+' || acao[acao.length - 1] == '#')
		acao = acao.slice(0, acao.length - 1);
	
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
function init() {
	checkForFileApiSupport();
	document.getElementById('file').addEventListener('change', handleFileSelect, false);
}

function checkForFileApiSupport() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // All the File APIs are supported.
    }
    else {
     alert('The File APIs are not fully supported in this browser.');
    }
}

function handleFileSelect(evt) {
	var f = evt.target.files[0];

	if (!f.type.match('x-chess-pgn.*')) {
		alert('Only .PGN files');
	}
	else{
		var reader = new FileReader();
		document.getElementById("form").style.position = 'absolute';	
		document.getElementById('form').style.visibility = 'hidden';	
		reader.onload = function(e) {
		if (e.target.readyState == FileReader.DONE) // DONE == 2
			var str = reader.result.split("\n");
			for(var i = 0; i < str.length; i++){
				var bracket = /^(\[)/;
				var empty_line = /^\s*$/;
				if(bracket.test(str[i]) || empty_line.test(str[i])){
					str.splice(i,1);
					i--;
				}
			}
			var al_words = new Array();
			for(var i = 0; i < str.length; i++){
				var words = str[i].split(/[" "]+/);
				var comment1 = /^(\;)/;
				var comment2 = /^(\{)/;
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
				}
				al_words = al_words.concat(words);
			}
			al_words.splice(al_words.length - 1, 1);
			var movs = [];
			var jog = 'W';
			for(var i = 0; i < al_words.length; i++){
				if(al_words[i].search(/\./) != -1){
					if(al_words[i][al_words[i].length - 1] != '.'){
						var aux = al_words[i].split(/\./);
						if(aux[1] == "O-O" || aux[1] == "O-O-O"){
							var m = castling(aux[i], jog);
							movs.push(m[0]);
							movs.push(m[1]);
						}
						else{
							var m = obj_mov(aux[1], jog);
							movs.push(m);
						}
						jog = changeJ(jog);
					}
					
				}
				else{
					if(al_words[i] == "O-O" || al_words[i] == "O-O-O"){
						var m = castling(al_words[i], jog);
						movs.push(m[0]);
						movs.push(m[1]);
					}
					else{
						var m = obj_mov(al_words[i], jog);
						movs.push(m);
					}
					jog = changeJ(jog);
				}
			}
			main(movs);
		}
		reader.readAsText(f, "UTF-8");	
	}
}


function main(movimentos){
	for(var f = 0; f < movimentos.length; f++){
		alert(movimentos[f].peca + " " + movimentos[f].movx + " " + movimentos[f].movy + " " +
				movimentos[f].jogador + " " + movimentos[f].kill + " " + movimentos[f].conflx + " " + movimentos[f].confly);
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
	webGLRenderer.setClearColor(0xaaaaff, 1.0);
	webGLRenderer.setSize(window.innerWidth, window.innerHeight);
	webGLRenderer.shadowMapEnabled = true;

	// position and point the camera to the center of the scene
	camera.position.x = -30;
	camera.position.y = 40;
	camera.position.z = 50;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

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
		'torre': null
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

	render();
	
	var t = true;

	function render() {
		// TODO: Update Args das operações

		// TODO:Ler evento de movimenTODO mouse

		// TODO: Atualizar argumento de Rotação

		// TODO: Atualizar argumento de Scale
		// TODO: Pop do movimento

		// TODO: Atualizar argumento da posição

		// Loop para cada peça
		for(object in objects){
			if(objects[object]){
				objects[object].rotation.x += 0.006;
			}
		}


		// render using requestAnimationFrame
		requestAnimationFrame(render);
		webGLRenderer.render(scene, camera);
	}
}
