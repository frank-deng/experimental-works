(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["testPage"],{"814c":function(a,t,r){"use strict";var e=r("adf4"),n=r.n(e);n.a},"831a":function(a,t,r){a.exports=r.p+"assets/img/tatami.jpg"},adf4:function(a,t,r){},e60a:function(a,t,r){"use strict";r.r(t);var e=function(){var a=this,t=a.$createElement,r=a._self._c||t;return r("div",{staticClass:"testPage"},[r("canvas",{ref:"drawCanvas",staticClass:"drawCanvas"})])},n=[],d={data:function(){return{}},mounted:function(){var a=this,t=2048,e=new Image;return e.src=r("831a"),new Promise(function(a,t){e.addEventListener("load",a),e.addEventListener("error",t)}).then(function(r){var n=a.$refs.drawCanvas;n.width=n.height=t;var d=n.getContext("2d");d.fillStyle="#332011",d.fillRect(0,0,t,t);var o=10,s=Math.round(t/4)-2*o,u=Math.round(t/2)-2*o;d.drawImage(e,o,o,s,u),d.drawImage(e,o,Math.round(t/2)+o,s,u),d.drawImage(e,Math.round(3*t/4)+o,o,s,u),d.drawImage(e,Math.round(3*t/4)+o,Math.round(t/2)+o,s,u),d.drawImage(e,Math.round(t/4)+o,Math.round(t/4)+o,s,u),d.drawImage(e,Math.round(t/2)+o,Math.round(t/4)+o,s,u),d.save(),d.translate(n.width/2,n.height/2),d.rotate(Math.PI/2),d.drawImage(e,Math.round(t/4)+o,-Math.round(t/4)+o,s,u),d.drawImage(e,-Math.round(t/2)+o,-Math.round(t/4)+o,s,u),d.restore()}).catch(function(t){a.$alert(t,{type:"error"}),console.error(t)})},methods:{}},o=d,s=(r("814c"),r("2877")),u=Object(s["a"])(o,e,n,!1,null,"55a10494",null);t["default"]=u.exports}}]);