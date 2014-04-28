$(function() {
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
});
