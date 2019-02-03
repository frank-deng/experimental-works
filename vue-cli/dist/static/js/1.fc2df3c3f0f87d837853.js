webpackJsonp([1],{"4A/p":function(t,e,r){t.exports=r.p+"static/img/car-in-top-view-512x512.f89abb7.png"},FF3r:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={data:function(){return{x:0,y:0,rotation:0,speed:1,steer:0}},computed:{carStyle:function(){return{left:this.x+"px",top:this.y+"px",transform:"rotate("+this.rotation+"deg)"}}},methods:{place:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;this.x=t,this.y=e,this.rotation=r},setSpeed:function(t){this.speed=t},setSteer:function(t){this.steer=t},nextMove:function(){this.rotation+=this.steer,this.x+=this.speed*Math.sin(Math.PI/180*this.rotation),this.y-=this.speed*Math.cos(Math.PI/180*this.rotation)},lookGround:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:40,n=this.x+r*Math.sin(Math.PI/180*this.rotation),a=this.y-r*Math.cos(Math.PI/180*this.rotation),i=e.width,s=e.height,o=e.getContext("2d");o.clearRect(0,0,i,s),o.save(),o.translate(i/2,s/2),o.rotate(-Math.PI/180*this.rotation),o.drawImage(t,n-i/2,a-s/2,i,s,-i/2,-s/2,i,s),o.restore()}},mounted:function(){}},a={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"car",style:this.carStyle},[e("img",{attrs:{src:r("4A/p")}})])},staticRenderFns:[]};var i=r("VU/8")(n,a,!1,function(t){r("MNGv")},"data-v-3ab9dbde",null);e.default=i.exports},Kjsf:function(t,e){},MNGv:function(t,e){},SK4Q:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={props:{width:Number,height:Number},data:function(){return{drawing:!1,ctx:void 0,x0:void 0,y0:void 0}},watch:{drawing:function(t){t||(this.x0=this.y0=void 0)}},methods:{clear:function(){var t=this.$refs.drawPad;this.ctx.clearRect(0,0,t.width,t.height),this.drawing=!1},getCanvas:function(){return this.$refs.drawPad}},mounted:function(){var t=this,e=this.$refs.drawPad;this.ctx=e.getContext("2d");var r=function(e,r){if(t.ctx&&t.drawing){if(void 0!==t.x0&&void 0!==t.y0){var n=t.ctx;n.beginPath(),n.moveTo(t.x0,t.y0),n.lineTo(e,r),n.stroke()}t.x0=e,t.y0=r}};e.addEventListener("mousedown",function(e){t.drawing=!0}),e.addEventListener("mouseup",function(e){t.drawing=!1}),e.addEventListener("mousemove",function(t){r(t.offsetX,t.offsetY)}),e.addEventListener("touchstart",function(e){t.drawing=!0}),e.addEventListener("touchend",function(e){0==e.touches.length&&(t.drawing=!1)}),e.addEventListener("touchmove",function(t){var n=e.getBoundingClientRect(),a=t.touches[0].clientX-n.left,i=t.touches[0].clientY-n.top;r(a,i)})}},a={render:function(){var t=this.$createElement;return(this._self._c||t)("canvas",{ref:"drawPad",staticClass:"drawPad",attrs:{width:this.width,height:this.height}})},staticRenderFns:[]};var i=r("VU/8")(n,a,!1,function(t){r("Kjsf")},"data-v-d4db6b56",null);e.default=i.exports},Zwel:function(t,e){},i6yL:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(t,e){for(var r=0;r<t.width;r++)try{if(t.data[4*(r*t.width+e)+3]>16)return!0}catch(t){console.error(t);continue}return!1};var a={components:{drawPad:r("SK4Q").default,car:r("FF3r").default},data:function(){return{analyzerResult:""}},methods:{clearDrawPad:function(){this.$refs.drawPad.clear()}},mounted:function(){var t=this;this.$refs.car.place(200,100,0),setInterval(function(){t.$refs.car.nextMove(),t.$refs.car.lookGround(t.$refs.drawPad.getCanvas(),t.$refs.groundCamera);var e,r,a=t.analyzerResult=function(t){for(var e=t.getContext("2d"),r=t.width,a=t.height,i=e.getImageData(r/4,a/4,r/2,a/2),s=i.width,o=(i.height,null),d=0;d<s&&null===o;d++)n(i,d)&&(o=d/s*2-1);for(var c=null,u=s-1;u>=0&&null===c;u--)n(i,u)&&(c=u/s*2-1);e.rect(r/4,a/4,r/2,a/2);var h=e.strokeStyle;return e.strokeStyle="#FF0000",e.stroke(),e.strokeStyle=h,[o,c]}(t.$refs.groundCamera);null===a[0]||null===a[1]?(t.$refs.car.setSteer(0),t.$refs.car.setSpeed(0)):(t.$refs.car.setSteer((e=a[0],r=a[1],(e+r)/2*8)),t.$refs.car.setSpeed(1))},100)}},i={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("div",{staticClass:"drawPadContainer"},[r("drawPad",{ref:"drawPad",attrs:{width:320,height:320}}),t._v(" "),r("car",{ref:"car"})],1),t._v(" "),r("div",{staticClass:"toolBox"},[r("el-button",{attrs:{size:"tiny"},on:{click:t.clearDrawPad}},[t._v("Clear")])],1),t._v(" "),r("div",{staticClass:"miscBox"},[r("p",[t._v("地面相机：\n      "),r("canvas",{ref:"groundCamera",staticClass:"groundCamera",attrs:{width:"64",height:"64"}})]),t._v(" "),r("p",[t._v("分析结果："+t._s(t.analyzerResult))])])])},staticRenderFns:[]};var s=r("VU/8")(a,i,!1,function(t){r("Zwel")},"data-v-2ecbbe10",null);e.default=s.exports}});