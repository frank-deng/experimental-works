webpackJsonp([1],{BZgn:function(e,t){},BsBs:function(e,t,o){var n=o("Ml+6");n.FlyControls=function(e,t){function o(e,t){return function(){t.apply(e,arguments)}}function i(e){e.preventDefault()}this.object=e,this.domElement=void 0!==t?t:document,t&&this.domElement.setAttribute("tabindex",-1),this.movementSpeed=1,this.rollSpeed=.005,this.dragToLook=!1,this.autoForward=!1,this.tmpQuaternion=new n.Quaternion,this.mouseStatus=0,this.moveState={up:0,down:0,left:0,right:0,forward:0,back:0,pitchUp:0,pitchDown:0,yawLeft:0,yawRight:0,rollLeft:0,rollRight:0},this.moveVector=new n.Vector3(0,0,0),this.rotationVector=new n.Vector3(0,0,0),this.handleEvent=function(e){"function"==typeof this[e.type]&&this[e.type](e)},this.keydown=function(e){if(!e.altKey){switch(e.keyCode){case 16:this.movementSpeedMultiplier=.1;break;case 87:this.moveState.forward=1;break;case 83:this.moveState.back=1;break;case 65:this.moveState.left=1;break;case 68:this.moveState.right=1;break;case 82:this.moveState.up=1;break;case 70:this.moveState.down=1;break;case 38:this.moveState.pitchUp=1;break;case 40:this.moveState.pitchDown=1;break;case 37:this.moveState.yawLeft=1;break;case 39:this.moveState.yawRight=1;break;case 81:this.moveState.rollLeft=1;break;case 69:this.moveState.rollRight=1}this.updateMovementVector(),this.updateRotationVector()}},this.keyup=function(e){switch(e.keyCode){case 16:this.movementSpeedMultiplier=1;break;case 87:this.moveState.forward=0;break;case 83:this.moveState.back=0;break;case 65:this.moveState.left=0;break;case 68:this.moveState.right=0;break;case 82:this.moveState.up=0;break;case 70:this.moveState.down=0;break;case 38:this.moveState.pitchUp=0;break;case 40:this.moveState.pitchDown=0;break;case 37:this.moveState.yawLeft=0;break;case 39:this.moveState.yawRight=0;break;case 81:this.moveState.rollLeft=0;break;case 69:this.moveState.rollRight=0}this.updateMovementVector(),this.updateRotationVector()},this.mousedown=function(e){if(this.domElement!==document&&this.domElement.focus(),e.preventDefault(),e.stopPropagation(),this.dragToLook)this.mouseStatus++;else{switch(e.button){case 0:this.moveState.forward=1;break;case 2:this.moveState.back=1}this.updateMovementVector()}},this.mousemove=function(e){if(!this.dragToLook||this.mouseStatus>0){var t=this.getContainerDimensions(),o=t.size[0]/2,n=t.size[1]/2;this.moveState.yawLeft=-(e.pageX-t.offset[0]-o)/o,this.moveState.pitchDown=(e.pageY-t.offset[1]-n)/n,this.updateRotationVector()}},this.mouseup=function(e){if(e.preventDefault(),e.stopPropagation(),this.dragToLook)this.mouseStatus--,this.moveState.yawLeft=this.moveState.pitchDown=0;else{switch(e.button){case 0:this.moveState.forward=0;break;case 2:this.moveState.back=0}this.updateMovementVector()}this.updateRotationVector()},this.update=function(e){var t=e*this.movementSpeed,o=e*this.rollSpeed;this.object.translateX(this.moveVector.x*t),this.object.translateY(this.moveVector.y*t),this.object.translateZ(this.moveVector.z*t),this.tmpQuaternion.set(this.rotationVector.x*o,this.rotationVector.y*o,this.rotationVector.z*o,1).normalize(),this.object.quaternion.multiply(this.tmpQuaternion),this.object.rotation.setFromQuaternion(this.object.quaternion,this.object.rotation.order)},this.updateMovementVector=function(){var e=this.moveState.forward||this.autoForward&&!this.moveState.back?1:0;this.moveVector.x=-this.moveState.left+this.moveState.right,this.moveVector.y=-this.moveState.down+this.moveState.up,this.moveVector.z=-e+this.moveState.back},this.updateRotationVector=function(){this.rotationVector.x=-this.moveState.pitchDown+this.moveState.pitchUp,this.rotationVector.y=-this.moveState.yawRight+this.moveState.yawLeft,this.rotationVector.z=-this.moveState.rollRight+this.moveState.rollLeft},this.getContainerDimensions=function(){return this.domElement!=document?{size:[this.domElement.offsetWidth,this.domElement.offsetHeight],offset:[this.domElement.offsetLeft,this.domElement.offsetTop]}:{size:[window.innerWidth,window.innerHeight],offset:[0,0]}},this.dispose=function(){this.domElement.removeEventListener("contextmenu",i,!1),this.domElement.removeEventListener("mousedown",s,!1),this.domElement.removeEventListener("mousemove",a,!1),this.domElement.removeEventListener("mouseup",r,!1),window.removeEventListener("keydown",l,!1),window.removeEventListener("keyup",c,!1)};var a=o(this,this.mousemove),s=o(this,this.mousedown),r=o(this,this.mouseup),l=o(this,this.keydown),c=o(this,this.keyup);this.domElement.addEventListener("contextmenu",i,!1),this.domElement.addEventListener("mousemove",a,!1),this.domElement.addEventListener("mousedown",s,!1),this.domElement.addEventListener("mouseup",r,!1),window.addEventListener("keydown",l,!1),window.addEventListener("keyup",c,!1),this.updateMovementVector(),this.updateRotationVector()}},Fciy:function(e,t){},JA56:function(e,t){},NHnr:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o("7+uW"),i={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},staticRenderFns:[]};var a=o("VU/8")({name:"App"},i,!1,function(e){o("JA56")},null,null).exports,s=o("/ocq"),r=o("BO1k"),l=o.n(r),c={data:function(){return{routeInfo:[]}},methods:{navigate:function(e){this.$router.push(this.routeInfo[e].path)}},mounted:function(){var e=!0,t=!1,o=void 0;try{for(var n,i=l()(this.$router.options.routes);!(e=(n=i.next()).done);e=!0){var a=n.value;a.path!==this.$route.path&&this.routeInfo.push(a)}}catch(e){t=!0,o=e}finally{try{!e&&i.return&&i.return()}finally{if(t)throw o}}}},h={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("ul",e._l(e.routeInfo,function(t,n){return o("li",[o("el-button",{attrs:{type:"primary"},on:{click:function(t){e.navigate(n)}}},[e._v(e._s(t.name))])],1)}))])},staticRenderFns:[]};var u=o("VU/8")(c,h,!1,function(e){o("BZgn")},"data-v-e911043e",null).exports,d={name:"HelloWorld",data:function(){return{selections:[{key:"HTML",label:"HTML使用"},{key:"CSS",label:"CSS使用"},{key:"JS",label:"JS使用"},{key:"vue_js",label:"vue.js使用"}],selected:[],textTable:{selections:{HTML:"HTML使用",CSS:"CSS使用",JS:"JS使用",vue_js:"vue.js使用"}},scores:[],tableCols:[],tableData:[]}},methods:{selectionChanged:function(){this.scores=[];var e=!0,t=!1,o=void 0;try{for(var n,i=l()(this.selected);!(e=(n=i.next()).done);e=!0){var a=n.value;this.scores.push({key:a,value:""})}}catch(e){t=!0,o=e}finally{try{!e&&i.return&&i.return()}finally{if(t)throw o}}this.scores.sort(function(e,t){return e.key>t.key?1:e.key<t.key?-1:0})}},mounted:function(){var e=this;window.dynTable=this,setTimeout(function(){e.tableCols=[{prop:"name",label:"名称"},{prop:"type",label:"类型"},{prop:"amount",label:"数量"}],e.$nextTick(function(){e.tableData=[{name:"aaa",type:"type1",amount:"1"},{name:"bbb",type:"type1",amount:"2"},{name:"ccc",type:"type3",amount:"3"}]})},1e3)}},m={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"hello"},[o("div",[o("el-select",{attrs:{multiple:""},on:{change:e.selectionChanged},model:{value:e.selected,callback:function(t){e.selected=t},expression:"selected"}},e._l(e.selections,function(e){return o("el-option",{key:e.key,attrs:{label:e.label,value:e.key}})}))],1),e._v(" "),o("div",e._l(e.scores,function(t){return o("div",{key:t.key},[o("div",[e._v(e._s(e.textTable.selections[t.key]))]),e._v(" "),o("el-input",{model:{value:t.value,callback:function(o){e.$set(t,"value",o)},expression:"item.value"}})],1)})),e._v(" "),o("el-table",{attrs:{data:e.scores}},[o("el-table-column",{attrs:{prop:"key",label:"名称"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e.textTable.selections[t.row.key]))]}}])}),e._v(" "),o("el-table-column",{attrs:{prop:"value",label:"值"}})],1),e._v(" "),o("hr"),e._v(" "),o("el-table",{attrs:{data:e.tableData}},e._l(this.tableCols,function(e){return o("el-table-column",{key:e.prop,attrs:{prop:e.prop,label:e.label}})}))],1)},staticRenderFns:[]};var p=o("VU/8")(d,m,!1,function(e){o("k+nX")},"data-v-1171bc46",null).exports,v={data:function(){return{audioCtx:void 0,gainNode:void 0,oscillator:void 0,soundType:"sine",running:!1,frequency:1e3,volume:.5}},methods:{changeVolume:function(e){this.running&&this.gainNode.gain.setValueAtTime(e,this.audioCtx.currentTime)},toggleBeep:function(){if(this.running)this.oscillator.stop(),this.running=!1;else{var e=this.audioCtx.createOscillator();e.type=this.soundType,e.frequency.setValueAtTime(this.frequency,this.audioCtx.currentTime),e.connect(this.gainNode),e.start(),this.oscillator=e,this.running=!0}}},mounted:function(){this.audioCtx=new AudioContext;var e=this.audioCtx.createGain();e.connect(this.audioCtx.destination),e.gain.setValueAtTime(this.volume,this.audioCtx.currentTime),this.gainNode=e}},f={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("el-row",[o("el-col",{attrs:{span:24}},[o("p",{staticClass:"itemTitle"},[e._v("类型")]),e._v(" "),o("el-select",{attrs:{disabled:e.running},model:{value:e.soundType,callback:function(t){e.soundType=t},expression:"soundType"}},[o("el-option",{attrs:{label:"正弦波",value:"sine"}}),e._v(" "),o("el-option",{attrs:{label:"方波",value:"square"}}),e._v(" "),o("el-option",{attrs:{label:"三角波",value:"triangle"}}),e._v(" "),o("el-option",{attrs:{label:"锯齿波",value:"sawtooth"}})],1)],1),e._v(" "),o("el-col",{attrs:{span:24}},[o("p",{staticClass:"itemTitle"},[e._v("频率")]),e._v(" "),o("el-input-number",{attrs:{min:1,max:44100,disabled:e.running},model:{value:e.frequency,callback:function(t){e.frequency=t},expression:"frequency"}})],1),e._v(" "),o("el-col",{attrs:{span:24}},[o("p",{staticClass:"itemTitle"},[e._v("音量")]),e._v(" "),o("el-slider",{attrs:{min:0,max:1,step:.001,"show-tooltip":!1},on:{change:e.changeVolume},model:{value:e.volume,callback:function(t){e.volume=t},expression:"volume"}})],1),e._v(" "),o("el-col",{attrs:{span:24}},[o("el-button",{attrs:{type:"primary"},on:{click:e.toggleBeep}},[e._v(e._s(e.running?"停止":"启动"))])],1)],1)],1)},staticRenderFns:[]};var E=o("VU/8")(v,f,!1,function(e){o("Ywom")},"data-v-35943258",null).exports,w={data:function(){return{time:"",timerReq:void 0,message:""}},methods:{updateTime:function(){this.request("http://localhost:8081/time.do")},doTimeout:function(){this.request("http://localhost:8081/timeout.do")},frequentRequest:function(){var e=this;this.timerReq?(clearInterval(this.timerReq),this.timerReq=void 0,this.message=""):this.timerReq=setInterval(function(){e.request("http://localhost:8081/time.do")},1)},request:function(e){var t=new XMLHttpRequest;t.timeout=2e3,t.onload=function(){console.log(this.responseText)},t.open("GET",e),t.send()||(this.message="Too many requests")}},mounted:function(){var e=function(){};e.prototype.show=function(){return"hahaha"};var t=new function(){var t=new e;return t.hahaha="2333",t};console.log(t.hahaha,t.show())}},y={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("el-button",{attrs:{type:"primary"},on:{click:e.updateTime}},[e._v("更新时间")]),e._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:e.doTimeout}},[e._v("超时请求")]),e._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:e.frequentRequest}},[e._v(e._s(e.timerReq?"停止请求":"大量请求"))]),e._v(" "),o("p",[e._v(e._s(e.message))])],1)},staticRenderFns:[]},T=o("VU/8")(w,y,!1,null,null,null).exports;window.THREE=o("Ml+6"),o("BsBs").default;var b=o("pXIW"),g={data:function(){return{}},mounted:function(){var e=this.$refs.webglContainer,t=new THREE.Scene;t.background=new THREE.Color(13426943);var o=new THREE.PerspectiveCamera(45,e.offsetWidth/e.offsetHeight,1,4e3);o.position.set(0,30,100);var n=new THREE.AmbientLight(16777215,.5);t.add(n);var i=new THREE.DirectionalLight(16777215,.5);i.position.set(0,200,300),t.add(i);var a=(new THREE.TextureLoader).load("static/FloorsCheckerboard_S_Diffuse.jpg",function(e){e.wrapS=e.wrapT=THREE.RepeatWrapping,e.offset.set(0,0),e.repeat.set(16,16)}),s=new THREE.PlaneGeometry(2e3,1e3),r=new THREE.MeshLambertMaterial({color:34816,map:a,side:THREE.FrontSide});r.reflectivity=0;var l=new THREE.Mesh(s,r);l.position.x=0,l.position.y=0,l.position.z=0,l.rotation.x=-Math.PI/2,t.add(l);a=(new THREE.TextureLoader).load("static/hahaha.jpg");var c=new THREE.CubeGeometry(20,20,20),h=new THREE.MeshPhongMaterial({map:a}),u=new THREE.Mesh(c,h);u.position.y=10,t.add(u);a=(new THREE.TextureLoader).load("static/earth_atmos_2048.jpg"),c=new THREE.SphereGeometry(6,60,60),h=new THREE.MeshPhongMaterial({map:a});var d=new THREE.Mesh(c,h);d.position.y=26,t.add(d);for(var m=new THREE.Group,p=new Array(7),v=0;v<p.length;v++){c=new THREE.SphereGeometry(5,60,60),h=new THREE.MeshPhongMaterial({color:6711039});p[v]=new THREE.Mesh(c,h),p[v].position.y=0;var f=2*Math.PI/p.length;p[v].position.x=20*Math.cos(f*v),p[v].position.z=20*Math.sin(f*v),m.add(p[v])}t.add(m),m.position.x=-50,m.position.y=5,m.position.z=0;var E=new THREE.Geometry,w=[new THREE.Vector3(5,10,4),new THREE.Vector3(-5,10,4),new THREE.Vector3(5,0,0),new THREE.Vector3(-5,0,0),new THREE.Vector3(5,0,6),new THREE.Vector3(-5,0,6)];for(v=0;v<w.length;v++)E.vertices.push(w[v]);E.faces.push(new THREE.Face3(0,1,2)),E.faces.push(new THREE.Face3(3,2,1)),E.faces.push(new THREE.Face3(2,3,4)),E.faces.push(new THREE.Face3(5,4,3));var y=[new THREE.Vector2(0,0),new THREE.Vector2(1,0),new THREE.Vector2(0,.5),new THREE.Vector2(1,.5),new THREE.Vector2(0,1),new THREE.Vector2(1,1)],T=[[y[5],y[4],y[3]],[y[2],y[3],y[4]],[y[3],y[2],y[1]],[y[0],y[1],y[2]]];for(v=0;v<T.length;v++)E.faceVertexUvs[0].push(T[v]);a=(new THREE.TextureLoader).load("static/hahaha.jpg"),h=new THREE.MeshPhongMaterial({map:a,side:THREE.DoubleSide});var g=new THREE.Mesh(E,h);t.add(g),g.position.x=50,g.position.y=10;var R=document.createElement("canvas");R.setAttribute("width",512),R.setAttribute("height",512);var H=new THREE.Texture(R),S=(h=new THREE.MeshPhongMaterial({map:H,side:THREE.DoubleSide}),new THREE.Mesh(E,h));t.add(S),S.position.x=30,S.position.y=10;var k=new THREE.WebGLRenderer({antialias:!0});k.setPixelRatio(window.devicePixelRatio),k.setSize(e.offsetWidth,e.offsetHeight),e.appendChild(k.domElement);var x=new THREE.Clock,_=new THREE.FlyControls(o);_.movementSpeed=30,_.domElement=e,_.rollSpeed=Math.PI/6,_.autoForward=!1,_.dragToLook=!0;var L=R.getContext("2d");L.fillStyle="#FFFFFF",L.fillRect(0,0,512,512);var M=L.createLinearGradient(0,0,512,0);M.addColorStop(0,"#ff0000"),M.addColorStop(1,"#00ff00"),L.fillStyle=M,L.fillRect(0,472,512,512),H.needsUpdate=!0,L.font="100px Sans",L.textAlign="left";setInterval(function(){var e=new Date,t=("0"+e.getHours()).substr(-2)+":"+("0"+e.getMinutes()).substr(-2)+":"+("0"+e.getSeconds()).substr(-2);L.fillStyle="#FFFFFF",L.fillRect(10,156,502,256),L.fillStyle="#0000FF",L.fillText(t,10,256),H.needsUpdate=!0},250),window.addEventListener("resize",function(){var t=e.offsetWidth,n=e.offsetHeight;k.setSize(t,n),o.aspect=t/n,o.updateProjectionMatrix()}),document.addEventListener("keydown",function(e){switch(window.event?e.keyCode:e.which){case 13:D=!D}});var C=new THREE.Raycaster,V=new THREE.Vector2,F=new b.Tween(g.position).to({y:5,z:10}).chain(new b.Tween(g.position).to({y:10,z:0}));e.addEventListener("mousedown",function(e){V.x=e.offsetX/e.target.offsetWidth*2-1,V.y=-e.offsetY/e.target.offsetHeight*2+1,C.setFromCamera(V,o);var n=C.intersectObjects(t.children);if(n&&n.length)switch(n[0].object){case u:D=!D;break;case S:var i=n[0].uv;console.dir(n[0].faceIndex,i.x,i.y);break;case g:F.start()}});var q=this.$refs.comment2d,P=new THREE.Vector3(0,10,4),D=!0;!function n(){var i=x.getDelta();k.render(t,o),_.update(i),D&&(d.rotation.y+=.005,u.rotation.y-=.005,m.rotation.y+=.01,g.rotation.y-=.01,S.rotation.y+=.01);var a=(new THREE.Vector3).setFromMatrixPosition(S.matrixWorld).add(P.clone().applyEuler(S.rotation)).project(o),s=a.x,r=a.y,l=a.z;s<1&&s>-1&&r<1&&r>-1&&l<1?(q.style.display="block",q.style.left=(s+1)/2*e.offsetWidth-q.offsetWidth+"px",q.style.top=(1-r)/2*e.offsetHeight+"px"):q.style.display="none",b.update(),requestAnimationFrame(n)}()}},R={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"main-container"},[t("div",{ref:"webglContainer",attrs:{id:"webgl_container"}}),this._v(" "),t("div",{ref:"comment2d",attrs:{id:"comment_2d"}},[this._v("Hahaha~~~")])])},staticRenderFns:[]};var H=o("VU/8")(g,R,!1,function(e){o("Fciy")},"data-v-3b4a1a02",null).exports;window.THREE=o("Ml+6"),o("BsBs").default;o("pXIW");var S={data:function(){return{uploadedFiles:[],imgData:void 0}},watch:{imgData:function(e){console.log(e)}},methods:{doUpload:function(){this.$refs.upload.click()},fileUploaded:function(e){var t=this,o=new Image;o.addEventListener("load",function(){var e=document.createElement("canvas");e.width=this.width,e.height=this.height;var o=e.getContext("2d");o.drawImage(this,0,0,this.width,this.height,0,0,this.width,this.height),t.imgData=o.getImageData(0,0,e.width,e.height)});var n=new FileReader;n.addEventListener("load",function(e){o.src=e.target.result}),n.readAsDataURL(e.target.files[0])}},mounted:function(){var e=this.$refs.webglContainer,t=new THREE.Scene;t.background=new THREE.Color(13426943);var o=new THREE.PerspectiveCamera(45,e.offsetWidth/e.offsetHeight,1,4e3);o.position.set(0,30,100);var n=new THREE.AmbientLight(16777215,.5);t.add(n);var i=new THREE.DirectionalLight(16777215,.5);i.position.set(0,200,300),t.add(i);var a=(new THREE.TextureLoader).load("static/FloorsCheckerboard_S_Diffuse.jpg",function(e){e.wrapS=e.wrapT=THREE.RepeatWrapping,e.offset.set(0,0),e.repeat.set(16,16)}),s=new THREE.PlaneGeometry(2e3,1e3),r=new THREE.MeshLambertMaterial({color:34816,map:a,side:THREE.FrontSide});r.reflectivity=0;var l=new THREE.Mesh(s,r);l.position.x=0,l.position.y=0,l.position.z=0,l.rotation.x=-Math.PI/2,t.add(l);a=(new THREE.TextureLoader).load("static/hahaha.jpg");var c=new THREE.CubeGeometry(20,20,20),h=new THREE.MeshPhongMaterial({map:a}),u=new THREE.Mesh(c,h);u.position.y=10,t.add(u);a=(new THREE.TextureLoader).load("static/earth_atmos_2048.jpg"),c=new THREE.SphereGeometry(6,60,60),h=new THREE.MeshPhongMaterial({map:a});var d=new THREE.Mesh(c,h);d.position.y=26,t.add(d);for(var m=new THREE.Group,p=new Array(7),v=0;v<p.length;v++){c=new THREE.SphereGeometry(5,60,60),h=new THREE.MeshPhongMaterial({color:6711039});p[v]=new THREE.Mesh(c,h),p[v].position.y=0;var f=2*Math.PI/p.length;p[v].position.x=20*Math.cos(f*v),p[v].position.z=20*Math.sin(f*v),m.add(p[v])}t.add(m),m.position.x=-50,m.position.y=5,m.position.z=0;var E=new THREE.WebGLRenderer({antialias:!0});E.setPixelRatio(window.devicePixelRatio),E.setSize(e.offsetWidth,e.offsetHeight),e.appendChild(E.domElement);var w=new THREE.Clock,y=new THREE.FlyControls(o);y.movementSpeed=30,y.domElement=e,y.rollSpeed=Math.PI/6,y.autoForward=!1,y.dragToLook=!0,window.addEventListener("resize",function(){var t=e.offsetWidth,n=e.offsetHeight;E.setSize(t,n),o.aspect=t/n,o.updateProjectionMatrix()});!function e(){var n=w.getDelta();E.render(t,o),y.update(n),requestAnimationFrame(e)}()}},k={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"main-container"},[t("div",{ref:"webglContainer",attrs:{id:"webgl_container"}}),this._v(" "),t("div",{staticClass:"other-container"},[t("input",{ref:"upload",attrs:{type:"file"},on:{change:this.fileUploaded}}),this._v(" "),t("el-button",{attrs:{type:"primary"},on:{click:this.doUpload}},[this._v("上传")])],1)])},staticRenderFns:[]};var x=o("VU/8")(S,k,!1,function(e){o("pfhL")},"data-v-2cbabf2d",null).exports;n.default.use(s.a);var _=new s.a({routes:[{path:"/",name:"首页",component:u},{path:"/DynamicTable",name:"动态添加表头和填写项目",component:p},{path:"/WebAudioAPI",name:"WebAudioAPI实验",component:E},{path:"/XHRTry",name:"XHR实验",component:T},{path:"/WebGL",name:"WebGL/three.js测试",component:H},{path:"/colordist",name:"颜色分布",component:x}]});_.beforeEach(function(e,t,o){document.title=e.name,o()});var L=_,M=o("zL8q"),C=o.n(M);o("tvR6");n.default.config.productionTip=!1,n.default.use(C.a,{zIndex:3e3}),new n.default({el:"#app",router:L,components:{App:a},template:"<App/>"});var V={audioCtx:void 0,oscillator:void 0,timeout:void 0};V.audioCtx=new AudioContext,n.default.prototype.$beep=function(e){if(clearTimeout(V.timeout),V.timeout=void 0,!e&&V.oscillator)V.oscillator.stop(),V.oscillator=void 0;else if(e){if(!V.oscillator){var t=V.audioCtx.createOscillator();t.type="square",t.frequency.setValueAtTime(2e3,V.audioCtx.currentTime),t.connect(V.audioCtx.destination),t.start(),V.oscillator=t}V.timeout=setTimeout(function(){V.oscillator.stop(),V.oscillator=void 0,V.timeout=void 0},1e3)}}},Ywom:function(e,t){},"k+nX":function(e,t){},pfhL:function(e,t){},tvR6:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.f39943c3282d2a6cc116.js.map