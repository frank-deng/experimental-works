window.THREE = require('three');
require('imports-loader?THREE=three!@/js/FlyControls.js').default;
const TWEEN = require('@tweenjs/tween.js');

function rgb2hex(r,g,b){
	return ('00'+r.toString(16)).slice(-2)
		+ ('00'+g.toString(16)).slice(-2)
		+ ('00'+b.toString(16)).slice(-2);
}
function hex2rgb(str){
	return {
		r: parseInt(str.slice(0, 2), 16),
		g: parseInt(str.slice(2, 4), 16),
		b: parseInt(str.slice(4, 6), 16),
	};
}

export default{
	data(){
		return {
			uploadedFiles: [],
			imgData: undefined,
			ballsGrp: undefined,
			balls: [],
		};
	},
	watch:{
		'imgData': function(imgData){
			this.balls.map((ball)=>{
				this.ballsGrp.remove(ball);
			});
			this.balls = [];

			let count = imgData.width * imgData.height;
			let colorDist = {};
			for (let i = 0; i < count; i++){
				let hex = rgb2hex(imgData.data[4*i], imgData.data[4*i+1], imgData.data[4*i+2]);
				if (colorDist[hex]) {
					colorDist[hex]++;
				} else {
					colorDist[hex] = 1;
				}
			}

			var dotGeometry = new THREE.Geometry();
			DelayMapBatch(Object.keys(colorDist), (hexColor)=>{
				let color = hex2rgb(hexColor);
				let material = new THREE.PointsMaterial({
					color: parseInt(hexColor, 16),
					size: 1,
				});
				let geometry = new THREE.Geometry();
				geometry.vertices.push(new THREE.Vector3(color.r, color.g, color.b));
				let ball = new THREE.Points(geometry, material);
				this.balls.push(ball);
				this.ballsGrp.add(ball);
			}, {
				batchSize: 1000,
			})
		},
	},
	methods:{
		doUpload(){
			this.$refs.upload.click();
		},
		fileUploaded(e){
			var vm = this;
			var image = new Image();
			image.addEventListener('load', function(){
				var canvas = document.createElement('canvas');
				canvas.width = this.width;
				canvas.height = this.height;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(this,
					0, 0, this.width, this.height,
					0, 0, canvas.width, canvas.height
				);
				vm.imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			});
			var reader = new FileReader();
			reader.addEventListener('load', function(event){
				image.src = event.target.result;
			});
			reader.readAsDataURL(e.target.files[0]);
		},
	},
	mounted(){
		var container = this.$refs.webglContainer;
		var scene = new THREE.Scene();
		scene.background = new THREE.Color(0xcce0ff);
		var camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 4000);
		camera.position.set(128,128,666);

		var bgLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(bgLight);

		var light = new THREE.DirectionalLight(0xFFFFFF, 0.2);
		light.position.set(0,2000,3000);
		scene.add(light);

		var map = new THREE.TextureLoader().load('static/FloorsCheckerboard_S_Diffuse.jpg', function(texture){
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.offset.set(0, 0);
			texture.repeat.set(16, 16);
		});
		var groundGeometry = new THREE.PlaneGeometry(4000,2000);
		var groundMaterial = new THREE.MeshLambertMaterial({color:0x008800, map:map, side:THREE.FrontSide});
		groundMaterial.reflectivity = 0;
		var ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.position.x = 0;
		ground.position.y = 0;
		ground.position.z = 0;
		ground.rotation.x = -Math.PI/2;
		scene.add(ground);

		var ballsGrp = new THREE.Group();
		scene.add(ballsGrp);
		ballsGrp.position.x = 0;
		ballsGrp.position.y = 1;
		ballsGrp.position.z = 0;
		this.ballsGrp = ballsGrp;

		//Draw lines for ballsGrp
		var geometry = new THREE.CubeGeometry(255,255,255);
		var material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			side:THREE.BackSide,
		});
		var cube = new THREE.Mesh(geometry, material);
		cube.position.x = 128;
		cube.position.y = 128;
		cube.position.z = 128;
		ballsGrp.add(cube);
	
		//Internal light for color display
		var light = new THREE.PointLight(0xFFFFFF, 0.3);
		light.position.set(128,128,128);
		ballsGrp.add(light);

		var renderer = new THREE.WebGLRenderer({antialias:true});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(container.offsetWidth, container.offsetHeight);
		container.appendChild(renderer.domElement);

		var clock = new THREE.Clock();
		var controls = new THREE.FlyControls( camera );
		controls.movementSpeed = 100;
		controls.domElement = container;
		controls.rollSpeed = Math.PI / 12;
		controls.autoForward = false;
		controls.dragToLook = true;

		window.addEventListener('resize', function(){
			var SCREEN_WIDTH = container.offsetWidth;
			var SCREEN_HEIGHT  = container.offsetHeight;
			renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
			camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
			camera.updateProjectionMatrix();
		});

		var animation = function(){
			var delta = clock.getDelta();
			renderer.render(scene, camera);
			controls.update(delta);
			requestAnimationFrame(animation);
		}
		animation();
	},
}
