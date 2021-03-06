import * as THREE from 'three';
window.THREE = THREE;
require('imports-loader?THREE=three!@/components/FlyControls.js').default;
import TWEEN from '@tweenjs/tween.js';
export default{
	data(){
		return {
		};
	},
	mounted(){
		var container = this.$refs.webglContainer;
		var scene = new THREE.Scene();
		scene.background = new THREE.Color(0xcce0ff);
		var camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 4000);
		camera.position.set(0,30,100);

		var bgLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(bgLight);

		var light = new THREE.DirectionalLight(0xFFFFFF, 0.5);
		light.position.set(0,200,300);
		scene.add(light);

		var map = new THREE.TextureLoader().load(require('@/assets/FloorsCheckerboard_S_Diffuse.jpg'), function(texture){
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.offset.set(0, 0);
			texture.repeat.set(16, 16);
		});
		var groundGeometry = new THREE.PlaneGeometry(2000,1000);
		var groundMaterial = new THREE.MeshLambertMaterial({color:0x008800, map:map, side:THREE.FrontSide});
		groundMaterial.reflectivity = 0;
		var ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.position.x = 0;
		ground.position.y = 0;
		ground.position.z = 0;
		ground.rotation.x = -Math.PI/2;
		scene.add(ground);

		var map = new THREE.TextureLoader().load(require('@/assets/hahaha.jpg'));
		var geometry = new THREE.CubeGeometry(20,20,20);
		var material = new THREE.MeshPhongMaterial({map:map});
		var cube = new THREE.Mesh(geometry, material);
		cube.position.y = 10;
		scene.add(cube);

		var map = new THREE.TextureLoader().load(require('@/assets/earth_atmos_2048.jpg'));
		var geometry = new THREE.SphereGeometry(6,60,60);
		var material = new THREE.MeshPhongMaterial({map:map});
		var ball = new THREE.Mesh(geometry, material);
		ball.position.y = 26;
		scene.add(ball);

		var ballsGrp = new THREE.Group();
		var balls = new Array(7);
		for (var i = 0; i < balls.length; i++) {
			var geometry = new THREE.SphereGeometry(5,60,60);
			var material = new THREE.MeshPhongMaterial({color:0x6666FF});
			balls[i] = new THREE.Mesh(geometry, material);
			balls[i].position.y = 0;
			var angleFrag = Math.PI*2/balls.length;
			balls[i].position.x = Math.cos(angleFrag * i) * 20;
			balls[i].position.z = Math.sin(angleFrag * i) * 20;
			ballsGrp.add(balls[i]);
		}
		scene.add(ballsGrp);
		ballsGrp.position.x = -50;
		ballsGrp.position.y = 5;
		ballsGrp.position.z = 0;

		var paperGeometry = new THREE.Geometry();
		var points = [
			new THREE.Vector3(5, 10, 4),
			new THREE.Vector3(-5, 10, 4),
			new THREE.Vector3(5, 0, 0),
			new THREE.Vector3(-5, 0, 0),
			new THREE.Vector3(5, 0, 6),
			new THREE.Vector3(-5, 0, 6),
		];
		for (var i = 0; i < points.length; i++) {
			paperGeometry.vertices.push(points[i]);
		}
		paperGeometry.faces.push(new THREE.Face3(0,1,2));
		paperGeometry.faces.push(new THREE.Face3(3,2,1));
		paperGeometry.faces.push(new THREE.Face3(2,3,4));
		paperGeometry.faces.push(new THREE.Face3(5,4,3));

		var uv = [
			new THREE.Vector2(0,0),
			new THREE.Vector2(1,0),
			new THREE.Vector2(0,0.5),
			new THREE.Vector2(1,0.5),
			new THREE.Vector2(0,1),
			new THREE.Vector2(1,1),
		]
		var uvAll = [
			[uv[5], uv[4], uv[3]],
			[uv[2], uv[3], uv[4]],
			[uv[3], uv[2], uv[1]],
			[uv[0], uv[1], uv[2]],
		];
		for (var i = 0; i < uvAll.length; i++){
			paperGeometry.faceVertexUvs[0].push(uvAll[i]);
		}

		var map = new THREE.TextureLoader().load(require('@/assets/hahaha.jpg'));
		var material = new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide});
		var paper = new THREE.Mesh(paperGeometry, material) ;
		scene.add(paper);
		paper.position.x = 50;
		paper.position.y = 10;

		var canvasForTexture = document.createElement('canvas');
		canvasForTexture.setAttribute('width', 512);
		canvasForTexture.setAttribute('height', 512);
		var canvasmap = new THREE.Texture(canvasForTexture);
		var material = new THREE.MeshPhongMaterial({map:canvasmap, side:THREE.DoubleSide});
		var paper2 = new THREE.Mesh(paperGeometry, material) ;
		scene.add(paper2);
		paper2.position.x = 30;
		paper2.position.y = 10;

		var renderer = new THREE.WebGLRenderer({antialias:true});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(container.offsetWidth, container.offsetHeight);
		container.appendChild(renderer.domElement);

		var clock = new THREE.Clock();
		var controls = new THREE.FlyControls( camera );
		controls.movementSpeed = 30;
		controls.domElement = container;
		controls.rollSpeed = Math.PI / 6;
		controls.autoForward = false;
		controls.dragToLook = true;

		var ctx = canvasForTexture.getContext('2d');
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0,0,512,512);
		var gradient = ctx.createLinearGradient(0,0,512,0);
		gradient.addColorStop(0, '#ff0000');
		gradient.addColorStop(1, '#00ff00');
		ctx.fillStyle = gradient;
		ctx.fillRect(0,512-40,512,512);
		canvasmap.needsUpdate = true;

		ctx.font = '100px Sans';
		ctx.textAlign = 'left';
		var showTime = function(){
			var date = new Date();
			var hour = ('0'+date.getHours()).substr(-2);
			var minute = ('0'+date.getMinutes()).substr(-2);
			var second = ('0'+date.getSeconds()).substr(-2);
			var text = hour+':'+minute+':'+second;
			ctx.fillStyle = '#FFFFFF';
			ctx.fillRect(10,256-100,502,256);
			ctx.fillStyle = '#0000FF';
			ctx.fillText(text,10,256);
			canvasmap.needsUpdate = true;
		}
		setInterval(showTime,250);


		window.addEventListener('resize', function(){
			var SCREEN_WIDTH = container.offsetWidth;
			var SCREEN_HEIGHT  = container.offsetHeight;
			renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
			camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
			camera.updateProjectionMatrix();
		});

		document.addEventListener('keydown', function(event){
			var key = window.event ? event.keyCode : event.which;
			switch (key){
				case 13:
					isAnimating = !isAnimating;
				break;
			}
		});

		/* Raycaster for clicking 3d objects */
		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();
		var tween = new TWEEN.Tween(paper.position).to({y:5, z:10})
			.chain(new TWEEN.Tween(paper.position).to({y:10, z:0}));
		container.addEventListener('mousedown', function(event){
			mouse.x = (event.offsetX / event.target.offsetWidth) * 2 - 1;
			mouse.y = -(event.offsetY / event.target.offsetHeight) * 2 + 1;
			raycaster.setFromCamera(mouse, camera);
			var intersects = raycaster.intersectObjects(scene.children);
			if (!intersects || !(intersects.length)) {
				return;
			}
			switch (intersects[0].object) {
				case cube:
					isAnimating = !isAnimating;
				break;
				case paper2:
					var uv = intersects[0].uv;
					console.dir(intersects[0].faceIndex, uv.x, uv.y);
				break;
				case paper:
					tween.start();
				break;
			}
		});

		var comment_2d = this.$refs.comment2d;
		var offsetVector = new THREE.Vector3(0, 10, 4);
		var isAnimating = true;
		var animation = function(){
			var delta = clock.getDelta();
			renderer.render(scene, camera);
			controls.update(delta);
			if (isAnimating) {
				ball.rotation.y += 0.005;
				cube.rotation.y -= 0.005;
				ballsGrp.rotation.y += 0.01;
				paper.rotation.y -= 0.01;
				paper2.rotation.y += 0.01;
			}
			
			//Display div beside 3d object
			var vector = new THREE.Vector3()
				.setFromMatrixPosition(paper2.matrixWorld)
				.add(offsetVector.clone().applyEuler(paper2.rotation))
				.project(camera);
			var x = vector.x, y = vector.y, z = vector.z;
			if (x < 1 && x > -1 && y < 1 && y > -1 && z < 1) {
				comment_2d.style.display = 'block';
				comment_2d.style.left = (x + 1) / 2 * container.offsetWidth - comment_2d.offsetWidth + 'px';
				comment_2d.style.top = (-y + 1) / 2 * container.offsetHeight + 'px';
			} else {
				comment_2d.style.display = 'none';
			}
			TWEEN.update();
			requestAnimationFrame(animation);
		}
		animation();
	},
}
