window.THREE = require('three');
require('imports-loader?THREE=three!@/js/FlyControls.js').default;
const TWEEN = require('@tweenjs/tween.js');
import {DragHandler} from './dragHandler.js';
import MainWorker from './main.worker.js';

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
var centerPoint = {
	x: 130,
	y: 130,
	z: 130,
};

export default{
	data(){
		return {
			uploadedFiles: [],

			speed: 1,
			speedDistance: 10,
			horAngle: 0,
			verAngle: 0,
			distance: 520,

			mouseHorAngle: 0,
			mouseVerAngle: 0,

			offsetHorAngle: 0,
			offsetVerAngle: 0,
			offsetDistance: 0,

			camera: undefined,
			ballsGrp: undefined,
			points: undefined,
		};
	},
	methods:{
		doUpload(){
			this.$refs.upload.click();
		},
		fileUploaded(e){
			new Promise((resolve, reject)=>{
				let reader = new FileReader();
				reader.addEventListener('load', function(event){
					resolve(event.target.result);
				});
				reader.readAsDataURL(e.target.files[0]);
			}).then((src)=>{
				return new Promise((resolve, reject)=>{
					let image = new Image();
					image.addEventListener('load', function(){
						resolve(this);
					});
					image.src = src;
				});
			}).then((image)=>{
				if (this.points){
					this.ballsGrp.remove(this.points);
				}

				let canvas = document.createElement('canvas');
				canvas.width = image.width;
				canvas.height = image.height;
				let ctx = canvas.getContext('2d');
				ctx.drawImage(image,
					0, 0, image.width, image.height,
					0, 0, canvas.width, canvas.height
				);
				let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				return new Promise((resolve, reject)=>{
					let worker = new MainWorker();
					worker.postMessage({imgData:imgData});
					worker.addEventListener('message', (event)=>{
						resolve(event.data.colorDist);
					});
				});
			}).then((colorDist)=>{
				let geometry = new THREE.Geometry();
				geometry.colors = [];

				DelayMapBatch(Object.keys(colorDist), (hexColor)=>{
					let color = hex2rgb(hexColor);
					let ox = Math.random()-0.5, oy = Math.random()-0.5, oz = Math.random()-0.5;
					geometry.vertices.push(new THREE.Vector3(color.r + ox, color.g + oy, color.b + oz));
					geometry.colors.push(new THREE.Color(parseInt(hexColor, 16)));
				}, {
					batchSize: 10000,
				}).then(()=>{
					this.points = new THREE.Points(geometry, new THREE.PointsMaterial({
						vertexColors: true,
					}));
					Object.assign(this.points.position, {x:2, y:2, z:2});
					this.ballsGrp.add(this.points);
				});
			}).catch((e)=>{
				throw e;
			});
		},
	},
	mounted(){
		var container = this.$refs.webglContainer;
		var scene = new THREE.Scene();
		scene.background = new THREE.Color(0x010101);

		var bgLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(bgLight);

		var light = new THREE.DirectionalLight(0xFFFFFF, 0.2);
		light.position.set(0,2000,3000);
		scene.add(light);

		var ballsGrp = new THREE.Group();
		scene.add(ballsGrp);
		ballsGrp.position.x = 0;
		ballsGrp.position.y = 1;
		ballsGrp.position.z = 0;
		this.ballsGrp = ballsGrp;

		//Draw background box for ballsGrp
		var geometry = new THREE.CubeGeometry(260,260,260);
		var material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			side:THREE.BackSide,
			transparent:true,
			opacity: 0.9,
		});
		var cube = new THREE.Mesh(geometry, material);
		cube.position.x = centerPoint.x;
		cube.position.y = centerPoint.y;
		cube.position.z = centerPoint.z;
		ballsGrp.add(cube);
	
		//Internal light for color display
		var light = new THREE.PointLight(0xFFFFFF, 0.3);
		light.position.set(130,130,130);
		ballsGrp.add(light);

		var renderer = new THREE.WebGLRenderer({antialias:true});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(container.offsetWidth, container.offsetHeight);
		container.appendChild(renderer.domElement);

		var camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 4000);
		this.camera = camera;

		window.addEventListener('resize', function(){
			var SCREEN_WIDTH = container.offsetWidth;
			var SCREEN_HEIGHT  = container.offsetHeight;
			renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
			camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
			camera.updateProjectionMatrix();
		});

		let animation = ()=>{
			this.verAngle += this.offsetVerAngle;
			if (this.verAngle <= -89) {
				this.verAngle = -89;
			} else if (this.verAngle >= 89) {
				this.verAngle = 89;
			}
			
			this.horAngle += this.offsetHorAngle;

			this.distance += this.offsetDistance;
			if (this.distance >= 1000) {
				this.distance = 1000;
			} else if (this.distance <= 1) {
				this.distance = 1;
			}

			let x = this.distance * Math.sin(this.horAngle * Math.PI / 180) * Math.cos(this.verAngle * Math.PI / 180) + centerPoint.x;
			let y = this.distance * Math.sin(this.verAngle * Math.PI / 180) + centerPoint.y;
			let z = this.distance * Math.cos(this.horAngle * Math.PI / 180) * Math.cos(this.verAngle * Math.PI / 180) + centerPoint.y;

			camera.position.set(x, y, z);
			camera.lookAt(new THREE.Vector3(
				centerPoint.x,
				centerPoint.y,
				centerPoint.z,
			));
			camera.up = new THREE.Vector3(0,1,0);
			renderer.render(scene, this.camera);
			requestAnimationFrame(animation);
		}
		animation();

		window.addEventListener('keydown', (e)=>{
			switch (e.keyCode) {
				case 38: //Up
					this.offsetVerAngle = this.speed;
				break;
				case 40: //Down
					this.offsetVerAngle = -this.speed;
				break;
				case 37: //Left
					this.offsetHorAngle = -this.speed;
				break;
				case 39: //Right
					this.offsetHorAngle = this.speed;
				break;
				case 109: //Farther
					this.offsetDistance = this.speedDistance;
				break;
				case 107: //Nearer
					this.offsetDistance = -this.speedDistance;
				break;
				default:
					//console.log(e);
				break;
			}
		});
		window.addEventListener('keyup', (e)=>{
			switch (e.keyCode) {
				case 38: //Up
				case 40: //Down
					this.offsetVerAngle = 0;
				break;
				case 37: //Left
				case 39: //Right
					this.offsetHorAngle = 0;
				break;
				case 109: //Farther
				case 107: //Nearer
					this.offsetDistance = 0;
				break;
			}
		});
		let dragHandler = new DragHandler((e, x0, y0, x1, y1)=>{
			this.horAngle += -(x1 - x0) / container.offsetWidth * 10;
			this.verAngle += (y1 - y0) / container.offsetHeight * 10;
		});
	},
}
