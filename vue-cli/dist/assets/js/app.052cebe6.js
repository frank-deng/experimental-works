(function(e){function t(t){for(var n,a,d=t[0],i=t[1],l=t[2],c=0,f=[];c<d.length;c++)a=d[c],u[a]&&f.push(u[a][0]),u[a]=0;for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n]);s&&s(t);while(f.length)f.shift()();return o.push.apply(o,l||[]),r()}function r(){for(var e,t=0;t<o.length;t++){for(var r=o[t],n=!0,a=1;a<r.length;a++){var d=r[a];0!==u[d]&&(n=!1)}n&&(o.splice(t--,1),e=i(i.s=r[0]))}return e}var n={},a={app:0},u={app:0},o=[];function d(e){return i.p+"assets/js/"+({DrawPad:"DrawPad",MusicBox:"MusicBox",WebAudioAPI:"WebAudioAPI",WebGLTry:"WebGLTry",dithering:"dithering",dtmf:"dtmf",routerGuard:"routerGuard",routerGuardFrame:"routerGuardFrame",routerGuardSlave1:"routerGuardSlave1",routerGuardSlave2:"routerGuardSlave2",routerGuardSlave3:"routerGuardSlave3",testPage:"testPage",zonePlate:"zonePlate","zrender-try":"zrender-try"}[e]||e)+"."+{DrawPad:"0cc3cbb5",MusicBox:"ea62f204",WebAudioAPI:"7da414a3",WebGLTry:"1a3ffb3a",dithering:"c3ad719b",dtmf:"d80054b2",routerGuard:"e9957e64",routerGuardFrame:"56bc4aee",routerGuardSlave1:"07aed15d",routerGuardSlave2:"e5a92996",routerGuardSlave3:"102ae7be",testPage:"83fae106",zonePlate:"b61d8ce1","zrender-try":"5f126e00"}[e]+".js"}function i(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.e=function(e){var t=[],r={DrawPad:1,MusicBox:1,WebAudioAPI:1,WebGLTry:1,dithering:1,dtmf:1,routerGuard:1,routerGuardFrame:1,testPage:1,zonePlate:1,"zrender-try":1};a[e]?t.push(a[e]):0!==a[e]&&r[e]&&t.push(a[e]=new Promise((function(t,r){for(var n="assets/css/"+({DrawPad:"DrawPad",MusicBox:"MusicBox",WebAudioAPI:"WebAudioAPI",WebGLTry:"WebGLTry",dithering:"dithering",dtmf:"dtmf",routerGuard:"routerGuard",routerGuardFrame:"routerGuardFrame",routerGuardSlave1:"routerGuardSlave1",routerGuardSlave2:"routerGuardSlave2",routerGuardSlave3:"routerGuardSlave3",testPage:"testPage",zonePlate:"zonePlate","zrender-try":"zrender-try"}[e]||e)+"."+{DrawPad:"92d0e275",MusicBox:"67d5e9b1",WebAudioAPI:"21153458",WebGLTry:"ceb689a3",dithering:"09c0ac3b",dtmf:"a9113eed",routerGuard:"74621655",routerGuardFrame:"d167749a",routerGuardSlave1:"31d6cfe0",routerGuardSlave2:"31d6cfe0",routerGuardSlave3:"31d6cfe0",testPage:"5c301139",zonePlate:"b1900641","zrender-try":"1c55fa23"}[e]+".css",u=i.p+n,o=document.getElementsByTagName("link"),d=0;d<o.length;d++){var l=o[d],c=l.getAttribute("data-href")||l.getAttribute("href");if("stylesheet"===l.rel&&(c===n||c===u))return t()}var f=document.getElementsByTagName("style");for(d=0;d<f.length;d++){l=f[d],c=l.getAttribute("data-href");if(c===n||c===u)return t()}var s=document.createElement("link");s.rel="stylesheet",s.type="text/css",s.onload=t,s.onerror=function(t){var n=t&&t.target&&t.target.src||u,o=new Error("Loading CSS chunk "+e+" failed.\n("+n+")");o.code="CSS_CHUNK_LOAD_FAILED",o.request=n,delete a[e],s.parentNode.removeChild(s),r(o)},s.href=u;var p=document.getElementsByTagName("head")[0];p.appendChild(s)})).then((function(){a[e]=0})));var n=u[e];if(0!==n)if(n)t.push(n[2]);else{var o=new Promise((function(t,r){n=u[e]=[t,r]}));t.push(n[2]=o);var l,c=document.createElement("script");c.charset="utf-8",c.timeout=120,i.nc&&c.setAttribute("nonce",i.nc),c.src=d(e),l=function(t){c.onerror=c.onload=null,clearTimeout(f);var r=u[e];if(0!==r){if(r){var n=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src,o=new Error("Loading chunk "+e+" failed.\n("+n+": "+a+")");o.type=n,o.request=a,r[1](o)}u[e]=void 0}};var f=setTimeout((function(){l({type:"timeout",target:c})}),12e4);c.onerror=c.onload=l,document.head.appendChild(c)}return Promise.all(t)},i.m=e,i.c=n,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(r,n,function(t){return e[t]}.bind(null,n));return r},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i.oe=function(e){throw console.error(e),e};var l=window["webpackJsonp"]=window["webpackJsonp"]||[],c=l.push.bind(l);l.push=t,l=l.slice();for(var f=0;f<l.length;f++)t(l[f]);var s=c;o.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"034f":function(e,t,r){"use strict";var n=r("64a9"),a=r.n(n);a.a},2027:function(e,t,r){"use strict";var n=r("2829"),a=r.n(n);a.a},2829:function(e,t,r){},"41cb":function(e,t,r){"use strict";r("7f7f"),r("ac4d"),r("8a81"),r("ac6a");var n=r("2b0e"),a=r("8c4f");n["default"].use(a["a"]);var u=new a["a"]({routes:[{path:"/",name:"首页",component:r("de88").default},{path:"/zrender",name:"ZRender Try",component:function(){return r.e("zrender-try").then(r.bind(null,"fd65"))}},{path:"/dtmf",name:"DTMF音效",component:function(){return r.e("dtmf").then(r.bind(null,"886b"))}},{path:"/WebAudioAPI",name:"WebAudioAPI实验",component:function(){return r.e("WebAudioAPI").then(r.bind(null,"2f10"))}},{path:"/MusicBox",name:"音乐盒",component:function(){return r.e("MusicBox").then(r.bind(null,"c82f"))}},{path:"/WebGLTry",name:"WebGL实验",component:function(){return r.e("WebGLTry").then(r.bind(null,"3e0f"))}},{path:"/DrawPad",name:"画画板",component:function(){return r.e("DrawPad").then(r.bind(null,"ce5a"))}},{path:"/dithering",name:"图像抖动处理",component:function(){return r.e("dithering").then(r.bind(null,"c779"))}},{path:"/routerGuard",name:"子页面处理",component:function(){return r.e("routerGuardFrame").then(r.bind(null,"bac1"))},children:[{path:"/routerGuard",name:"子页面处理-正式页面",component:function(){return r.e("routerGuard").then(r.bind(null,"6be3"))},children:[{path:"slave1",name:"1号子页面",component:function(){return r.e("routerGuardSlave1").then(r.bind(null,"3b9c"))},meta:{permission:1}},{path:"slave2",name:"2号子页面",component:function(){return r.e("routerGuardSlave2").then(r.bind(null,"828b"))},meta:{permission:2}},{path:"slave3",component:function(){return r.e("routerGuardSlave3").then(r.bind(null,"382d"))},meta:{permission:3}}]}]},{path:"/zonePlate",name:"Zone Plate",component:function(){return r.e("zonePlate").then(r.bind(null,"47e0"))}},{path:"/arranger",name:"排班表",component:function(){return r.e("zonePlate").then(r.bind(null,"fa8e"))}},{path:"/testPage",name:"测试页面",component:function(){return r.e("testPage").then(r.bind(null,"e60a"))}}]});u.afterEach((function(e,t){var r="",n=!0,a=!1,u=void 0;try{for(var o,d=e.matched[Symbol.iterator]();!(n=(o=d.next()).done);n=!0){var i=o.value;i.name&&(r=i.name)}}catch(l){a=!0,u=l}finally{try{n||null==d.return||d.return()}finally{if(a)throw u}}document.title=r})),t["a"]=u},"56d7":function(e,t,r){"use strict";r.r(t);r("9e1f"),r("450d");var n=r("6ed5"),a=r.n(n),u=(r("be4f"),r("896a")),o=r.n(u),d=(r("0fb7"),r("f529")),i=r.n(d),l=(r("fd71"),r("a447")),c=r.n(l),f=(r("fe07"),r("6ac5")),s=r.n(f),p=(r("3c52"),r("0d7b")),m=r.n(p),h=(r("b5d8"),r("f494")),b=r.n(h),v=(r("e612"),r("dd87")),y=r.n(v),g=(r("075a"),r("72aa")),G=r.n(g),P=(r("a7cc"),r("df33")),w=r.n(P),S=(r("5466"),r("ecdf")),A=r.n(S),x=(r("38a0"),r("ad41")),T=r.n(x),W=(r("a586"),r("7464")),z=r.n(W),M=(r("e960"),r("b35b")),_=r.n(M),C=(r("eca7"),r("3787")),I=r.n(C),L=(r("425f"),r("4105")),k=r.n(L),B=(r("f225"),r("89a9")),j=r.n(B),D=(r("f4f9"),r("c2cc")),O=r.n(D),$=(r("7a0f"),r("0f6c")),E=r.n($),F=(r("9d4c"),r("e450")),N=r.n(F),V=(r("10cb"),r("f3ad")),q=r.n(V),J=(r("6611"),r("e772")),Z=r.n(J),H=(r("1f1a"),r("4e4b")),K=r.n(H),R=(r("b5c2"),r("20cf")),U=r.n(R),Q=(r("ae26"),r("845f")),X=r.n(Q),Y=(r("1951"),r("eedf")),ee=r.n(Y),te=(r("cadf"),r("551c"),r("f751"),r("097d"),r("3a34")),re=r.n(te),ne=r("2b0e"),ae=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("div",{staticClass:"masterMenuBar"},[r("el-button",{attrs:{type:"text",icon:"el-icon-menu"},on:{click:e.backToMenu}}),r("el-button",{staticClass:"showVConsole",attrs:{type:"text",icon:"el-icon-setting"},on:{click:e.showVConsole}})],1),r("div",{staticClass:"routerView"},[r("router-view")],1)])},ue=[],oe={name:"App",methods:{backToMenu:function(){this.$router.push("/")},showVConsole:function(){self.vConsole.show()}}},de=oe,ie=(r("034f"),r("2877")),le=Object(ie["a"])(de,ae,ue,!1,null,null,null),ce=le.exports,fe=r("41cb"),se=(r("0fae"),r("bc3a")),pe=r.n(se),me=r("ecee"),he=r("c074"),be=r("ad3d"),ve=new re.a;ve.show(),self.vConsole=ve,ne["default"].prototype.axios=pe.a,ne["default"].config.productionTip=!1,ne["default"].use(ee.a),ne["default"].use(X.a),ne["default"].use(U.a),ne["default"].use(K.a),ne["default"].use(Z.a),ne["default"].use(q.a),ne["default"].use(N.a),ne["default"].use(E.a),ne["default"].use(O.a),ne["default"].use(j.a),ne["default"].use(k.a),ne["default"].use(I.a),ne["default"].use(_.a),ne["default"].use(z.a),ne["default"].use(T.a),ne["default"].use(A.a),ne["default"].use(w.a),ne["default"].use(G.a),ne["default"].use(y.a),ne["default"].use(b.a),ne["default"].use(m.a),ne["default"].use(s.a),ne["default"].use(c.a),ne["default"].prototype.$message=i.a,ne["default"].prototype.$loading=o.a,ne["default"].prototype.$alert=a.a.alert,ne["default"].prototype.$prompt=a.a.prompt,ne["default"].prototype.$confirm=a.a.confirm,me["c"].add(he["b"]),me["c"].add(he["a"]),me["c"].add(he["c"]),ne["default"].component("font-awesome-icon",be["a"]),new ne["default"]({router:fe["a"],render:function(e){return e(ce)}}).$mount("#app")},"64a9":function(e,t,r){},de88:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"mainFrame"},e._l(e.routeInfo,(function(t,n){return r("el-button",{key:t.name,attrs:{type:"primary"},on:{click:function(t){return e.navigate(n)}}},[e._v(e._s(t.name))])})),1)},a=[],u=(r("ac4d"),r("8a81"),r("ac6a"),r("41cb"),{data:function(){return{routeInfo:[]}},methods:{navigate:function(e){this.$router.push(this.routeInfo[e].path)}},mounted:function(){var e=!0,t=!1,r=void 0;try{for(var n,a=this.$router.options.routes[Symbol.iterator]();!(e=(n=a.next()).done);e=!0){var u=n.value;u.path!==this.$route.path&&this.routeInfo.push(u)}}catch(o){t=!0,r=o}finally{try{e||null==a.return||a.return()}finally{if(t)throw r}}}}),o=u,d=(r("2027"),r("2877")),i=Object(d["a"])(o,n,a,!1,null,"23293e06",null);t["default"]=i.exports}});