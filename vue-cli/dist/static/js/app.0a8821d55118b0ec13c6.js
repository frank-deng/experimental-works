webpackJsonp([1],{"+BTi":function(t,e){},0:function(t,e){},"81N2":function(t,e){},BxWU:function(t,e){},GXEp:function(t,e){},I4nB:function(t,e){},NHnr:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});i("jZDA"),i("+BTi");var n=i("91Nw"),a=i.n(n),o=(i("d7TW"),i("ajQY")),s=i.n(o),u=(i("Zki6"),i("0kY3")),r=i.n(u),l=(i("X+ky"),i("HJMx")),c=i.n(l),d=(i("I4nB"),i("STLj")),f=i.n(d),v=(i("cDSy"),i("e0Bm")),h=i.n(v),m=(i("BxWU"),i("g2bL")),p=i.n(m),y=(i("GXEp"),i("mtrD")),C=i.n(y),g=i("7+uW"),x={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var T=i("VU/8")({name:"App"},x,!1,function(t){i("R9Ve")},null,null).exports,_=i("/ocq"),w=i("BO1k"),A=i.n(w);var b={data:function(){return{routeInfo:[]}},methods:{navigate:function(t){this.$router.push(this.routeInfo[t].path)}},mounted:function(){var t=!0,e=!1,i=void 0;try{for(var n,a=A()(this.$router.options.routes);!(t=(n=a.next()).done);t=!0){var o=n.value;o.path!==this.$route.path&&this.routeInfo.push(o)}}catch(t){e=!0,i=t}finally{try{!t&&a.return&&a.return()}finally{if(e)throw i}}!function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.5,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,i=e||new AudioContext,n=i.createGain();n.gain.setValueAtTime(t,i.currentTime),n.connect(i.destination);var a=i.createOscillator();a.type="square",a.frequency.setValueAtTime(2e3,i.currentTime),a.frequency.setValueAtTime(1e3,i.currentTime+.15),a.connect(n),a.start(),a.stop(i.currentTime+.3),setTimeout(function(){n.disconnect(),a.disconnect(),e||i.close()},400)}(.2)}},q={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"mainFrame"},[i("ul",t._l(t.routeInfo,function(e,n){return i("li",[i("el-button",{attrs:{type:"primary"},on:{click:function(e){t.navigate(n)}}},[t._v(t._s(e.name))])],1)}))])},staticRenderFns:[]};var k=i("VU/8")(b,q,!1,function(t){i("lC8v")},"data-v-75edaf8a",null).exports,B=i("//Fk"),P=i.n(B),V={"*":[941,1209],0:[941,1336],"#":[941,1477],1:[697,1209],2:[697,1336],3:[697,1477],4:[770,1209],5:[770,1336],6:[770,1477],7:[852,1209],8:[852,1336],9:[852,1477]},E={data:function(){return{dialNum:void 0,volume:.5,volumeKeyPress:.5,audioCtx:void 0,freq0:void 0,freq1:void 0,gainMaster:void 0,soundEffect:{keyPress:void 0,keyPressGain:void 0}}},watch:{dialNum:function(t){if(t){var e=V[t];this.freq0.frequency.setValueAtTime(e[0],this.audioCtx.currentTime),this.freq1.frequency.setValueAtTime(e[1],this.audioCtx.currentTime),this.gainMaster.connect(this.audioCtx.destination);var i=this.audioCtx.createBufferSource();i.buffer=this.soundEffect.keyPress,i.connect(this.soundEffect.keyPressGain),i.start()}else this.gainMaster.disconnect()},volume:function(t){this.gainMaster.gain.setValueAtTime(t,this.audioCtx.currentTime)},volumeKeyPress:function(t){this.soundEffect.keyPressGain.gain.setValueAtTime(t,this.audioCtx.currentTime)}},methods:{changeVolume:function(t){this.running},dial:function(t){this.dialNum=t}},mounted:function(){var t=this;this.audioCtx=new AudioContext,this.gainMaster=this.audioCtx.createGain(),this.gainMaster.gain.setValueAtTime(this.volume,this.audioCtx.currentTime);var e=this.audioCtx.createChannelMerger(2);e.connect(this.gainMaster);var i=this.audioCtx.createGain();i.connect(e),i.gain.setValueAtTime(.5,this.audioCtx.currentTime),this.freq0=this.audioCtx.createOscillator(),this.freq0.type="sine",this.freq0.connect(i),this.freq0.start();var n=this.audioCtx.createGain();n.connect(e),n.gain.setValueAtTime(.5,this.audioCtx.currentTime),this.freq1=this.audioCtx.createOscillator(),this.freq1.type="sine",this.freq1.connect(n),this.freq1.start(),this.soundEffect.keyPressGain=this.audioCtx.createGain(),this.soundEffect.keyPressGain.connect(this.audioCtx.destination),this.soundEffect.keyPressGain.gain.setValueAtTime(this.volumeKeyPress,this.audioCtx.currentTime),this.$http.get("static/keypress.ogg",{responseType:"arraybuffer"}).then(function(e){return new P.a(function(i){t.audioCtx.decodeAudioData(e.body,function(t){i(t)})})}).then(function(e){t.soundEffect.keyPress=e});var a=this,o={0:function(){a.dial("0")},1:function(){a.dial("1")},2:function(){a.dial("2")},3:function(){a.dial("3")},4:function(){a.dial("4")},5:function(){a.dial("5")},6:function(){a.dial("6")},7:function(){a.dial("7")},8:function(){a.dial("8")},9:function(){a.dial("9")},"*":function(){a.dial("*")},"-":function(){a.dial("#")},"#":function(){a.dial("#")}};window.addEventListener("keydown",function(t){o[t.key]&&o[t.key]()}),window.addEventListener("keyup",function(e){t.dial()})}},N={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"mainFrame"},[i("el-row",[i("el-col",{attrs:{span:24}},[i("p",{staticClass:"itemTitle"},[t._v("DTMF音量")]),t._v(" "),i("el-slider",{attrs:{min:0,max:1,step:.001,"show-tooltip":!1},model:{value:t.volume,callback:function(e){t.volume=e},expression:"volume"}})],1),t._v(" "),i("el-col",{attrs:{span:24}},[i("p",{staticClass:"itemTitle"},[t._v("按键声音量")]),t._v(" "),i("el-slider",{attrs:{min:0,max:1,step:.001,"show-tooltip":!1},model:{value:t.volumeKeyPress,callback:function(e){t.volumeKeyPress=e},expression:"volumeKeyPress"}})],1)],1),t._v(" "),i("div",{staticClass:"dialPad",on:{touchend:function(e){t.dial()},mouseup:function(e){t.dial()}}},[i("div",{staticClass:"dialBtn",on:{mousedown:function(e){t.dial("7")},touchstart:function(e){t.dial("7")}}},[i("i",[t._v("7")])]),t._v(" "),i("div",{staticClass:"dialBtn",on:{mousedown:function(e){t.dial("8")},touchstart:function(e){t.dial("8")}}},[i("i",[t._v("8")])]),t._v(" "),i("div",{staticClass:"dialBtn",on:{mousedown:function(e){t.dial("9")},touchstart:function(e){t.dial("9")}}},[i("i",[t._v("9")])]),t._v(" "),i("div",{staticClass:"dialBtn",on:{mousedown:function(e){t.dial("4")},touchstart:function(e){t.dial("4")}}},[i("i",[t._v("4")])]),t._v(" "),i("div",{staticClass:"dialBtn",on:{mousedown:function(e){t.dial("5")},touchstart:function(e){t.dial("5")}}},[i("i",[t._v("5")])]),t._v(" "),i("div",{staticClass:"dialBtn",on:{mousedown:function(e){t.dial("6")},touchstart:function(e){t.dial("6")}}},[i("i",[t._v("6")])]),t._v(" "),i("div",{staticClass:"dialBtn",on:{mousedown:function(e){t.dial("1")},touchstart:function(e){t.dial("1")}}},[i("i",[t._v("1")])]),t._v(" "),i("div",{staticClass:"dialBtn",on:{mousedown:function(e){t.dial("2")},touchstart:function(e){t.dial("2")}}},[i("i",[t._v("2")])]),t._v(" "),i("div",{staticClass:"dialBtn",on:{mousedown:function(e){t.dial("3")},touchstart:function(e){t.dial("3")}}},[i("i",[t._v("3")])]),t._v(" "),i("div",{staticClass:"dialBtn",on:{mousedown:function(e){t.dial("*")},touchstart:function(e){t.dial("*")}}},[i("i",[t._v("*")])]),t._v(" "),i("div",{staticClass:"dialBtn",on:{mousedown:function(e){t.dial("0")},touchstart:function(e){t.dial("0")}}},[i("i",[t._v("0")])]),t._v(" "),i("div",{staticClass:"dialBtn",on:{mousedown:function(e){t.dial("#")},touchstart:function(e){t.dial("#")}}},[i("i",[t._v("#")])])])],1)},staticRenderFns:[]};var G=i("VU/8")(E,N,!1,function(t){i("ZoaN")},"data-v-1ea21218",null).exports,M={data:function(){return{audioCtx:void 0,gainNode:void 0,oscillator:void 0,soundType:"sine",running:!1,frequency:1e3,volume:.5}},watch:{volume:function(t){this.running&&this.gainNode.gain.setValueAtTime(t,this.audioCtx.currentTime)},frequency:function(t){this.running&&this.oscillator.frequency.setValueAtTime(t,this.audioCtx.currentTime)}},methods:{toggleBeep:function(){if(this.running)this.oscillator.stop(),this.running=!1;else{var t=this.audioCtx.createOscillator();t.type=this.soundType,t.frequency.setValueAtTime(this.frequency,this.audioCtx.currentTime),t.connect(this.gainNode),t.start(),this.oscillator=t,this.running=!0,this.gainNode.gain.setValueAtTime(this.volume,this.audioCtx.currentTime)}}},mounted:function(){this.audioCtx=new AudioContext;var t=this.audioCtx.createGain();t.connect(this.audioCtx.destination),t.gain.setValueAtTime(this.volume,this.audioCtx.currentTime),this.gainNode=t}},F={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"WebAudioAPI"},[i("el-row",[i("el-col",{attrs:{span:24}},[i("p",{staticClass:"itemTitle"},[t._v("类型")]),t._v(" "),i("el-select",{attrs:{disabled:t.running},model:{value:t.soundType,callback:function(e){t.soundType=e},expression:"soundType"}},[i("el-option",{attrs:{label:"正弦波",value:"sine"}}),t._v(" "),i("el-option",{attrs:{label:"方波",value:"square"}}),t._v(" "),i("el-option",{attrs:{label:"三角波",value:"triangle"}}),t._v(" "),i("el-option",{attrs:{label:"锯齿波",value:"sawtooth"}})],1)],1),t._v(" "),i("el-col",{attrs:{span:24}},[i("p",{staticClass:"itemTitle"},[t._v("频率")]),t._v(" "),i("el-input-number",{attrs:{min:0,max:44100},model:{value:t.frequency,callback:function(e){t.frequency=e},expression:"frequency"}})],1),t._v(" "),i("el-col",{attrs:{span:24}},[i("p",{staticClass:"itemTitle"},[t._v("音量")]),t._v(" "),i("el-slider",{attrs:{min:0,max:1,step:.001,"show-tooltip":!1},model:{value:t.volume,callback:function(e){t.volume=e},expression:"volume"}})],1),t._v(" "),i("el-col",{attrs:{span:24}},[i("el-button",{attrs:{type:"primary"},on:{click:t.toggleBeep}},[t._v(t._s(t.running?"停止":"启动"))])],1)],1)],1)},staticRenderFns:[]};var D=i("VU/8")(M,F,!1,function(t){i("81N2")},"data-v-3815274f",null).exports;var I={data:function(){return{audioCtx:void 0,gainNode:void 0,oscillator:void 0,soundType:"square",running:!1,volume:.5,song:""}},watch:{volume:function(t){this.running&&this.gainNode.gain.setValueAtTime(t,this.audioCtx.currentTime)}},methods:{stopPlaying:function(){this.oscillator.stop(),this.running=!1},togglePlay:function(){var t=this;if(this.running)this.stopPlaying();else{this.gainNode.gain.setValueAtTime(this.volume,this.audioCtx.currentTime);var e=this.audioCtx.createOscillator();e.type=this.soundType;var i=function(t){for(var e=t.slice(),i=void 0,n=0,a=[],o={C:!0,"C+":!0,D:!0,"D+":!0,E:!0,F:!0,"F+":!0,G:!0,"G+":!0,A:!0,"A+":!0,B:!0},s={"D-":"C+","E-":"D+","G-":"F+","A-":"G+","B-":"A+"};e.length;){if(i=/^\s+/.exec(e));else if(i=/^(T|L|O|P)(\d+)/i.exec(e))a.push([i[1].toUpperCase(),Number(i[2])]);else if(i=/^(ML|MN|MS|\<|\>)/i.exec(e))a.push([i[0].toUpperCase()]);else{if(!(i=/^([CDEFGAB][#+-]?)(\d*)(\.*)/i.exec(e)))throw SyntaxError("Invalid MML character at position "+n);var u=i[1].toUpperCase().replace("#","+");if(s[u]&&(u=s[u]),!o[u])throw SyntaxError("Invalid note "+i[1]+" at position "+n);a.push([u,Number(i[2]),i[3]])}e=e.slice(i[0].length),n+=i[0].length}var r=5,l=1.875,c=4,d=.01,f=0,v=[],h=[16.352,17.324,18.354,19.445,20.602,21.827,23.125,24.5,25.967,27.5,29.135,30.868,32.703,34.648,36.709,38.891,41.203,43.654,46.249,48.999,51.913,55,58.27,61.736,65.406,69.296,73.416,77.782,82.407,87.307,92.499,97.999,103.83,110,116.54,123.47,130.81,138.59,146.83,155.56,164.81,174.61,185,196,207.65,220,233.08,246.94,261.63,227.18,293.66,311.13,326.63,349.23,369.99,392,415.3,440,466.16,493.88,523.25,554.37,587.33,622.25,659.26,698.46,739.99,783.99,830.61,880,932.33,987.77,1046.5,1108.7,1174.7,1244.5,1318.5,1396.9,1480,1568,1661.2,1760,1864.7,1975.53,2093,2217.5,2349.3,2489,2637,2793.8,2960,3136,3322.4,3520,3729.3,3951.05,4186,4439.9,4498.6,4978,5474,5587.7,5919.9,6271.9,6644.9,7040,7458.6,7902.1],m={ML:function(){d=0},MS:function(){d=.1},MN:function(){d=.05},"<":function(){r>0&&r--},">":function(){r<8&&r++},T:function(t){l=240/t},L:function(t){c=t},O:function(t){r=t}},p={P:0,C:1,"C+":2,D:3,"D+":4,E:5,F:6,"F+":7,G:8,"G+":9,A:10,"A+":11,B:12},y=!0,C=!1,g=void 0;try{for(var x,T=A()(a);!(y=(x=T.next()).done);y=!0){var _=x.value;if(m[_[0]])m[_[0]](_[1]);else{var w=_[0];if(void 0!==p[w]){var b=l/(_[1]||c);_[2]&&(b*=Math.pow(1.5,_[2].length)),v.push({freq:p[w]?h[p[w]-1+12*r]:0,time:f}),d&&v.push({freq:0,time:f+b}),f+=b+d}}}}catch(t){C=!0,g=t}finally{try{!y&&T.return&&T.return()}finally{if(C)throw g}}return v.push({freq:0,time:f}),v}(this.song),n=!0,a=!1,o=void 0;try{for(var s,u=A()(i);!(n=(s=u.next()).done);n=!0){var r=s.value;e.frequency.setValueAtTime(r.freq,this.audioCtx.currentTime+r.time)}}catch(t){a=!0,o=t}finally{try{!n&&u.return&&u.return()}finally{if(a)throw o}}e.connect(this.gainNode),e.start(),e.stop(this.audioCtx.currentTime+i[i.length-1].time+.1),e.addEventListener("ended",function(){t.stopPlaying()}),this.oscillator=e,this.running=!0}}},mounted:function(){this.audioCtx=new AudioContext;var t=this.audioCtx.createGain();t.connect(this.audioCtx.destination),t.gain.setValueAtTime(this.volume,this.audioCtx.currentTime),this.gainNode=t}},L={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"WebAudioAPI"},[i("el-row",[i("el-col",{attrs:{span:24}},[i("p",{staticClass:"itemTitle"},[t._v("类型")]),t._v(" "),i("el-select",{attrs:{disabled:t.running},model:{value:t.soundType,callback:function(e){t.soundType=e},expression:"soundType"}},[i("el-option",{attrs:{label:"方波",value:"square"}}),t._v(" "),i("el-option",{attrs:{label:"三角波",value:"triangle"}}),t._v(" "),i("el-option",{attrs:{label:"正弦波",value:"sine"}}),t._v(" "),i("el-option",{attrs:{label:"锯齿波",value:"sawtooth"}})],1)],1),t._v(" "),i("el-col",{attrs:{span:24}},[i("p",{staticClass:"itemTitle"},[t._v("乐曲")]),t._v(" "),i("el-input",{attrs:{type:"textarea",rows:3,disabled:t.running},model:{value:t.song,callback:function(e){t.song=e},expression:"song"}})],1),t._v(" "),i("el-col",{attrs:{span:24}},[i("p",{staticClass:"itemTitle"},[t._v("音量")]),t._v(" "),i("el-slider",{attrs:{min:0,max:1,step:.001,"show-tooltip":!1},model:{value:t.volume,callback:function(e){t.volume=e},expression:"volume"}})],1),t._v(" "),i("el-col",{attrs:{span:24}},[i("el-button",{attrs:{type:"primary"},on:{click:t.togglePlay}},[t._v(t._s(t.running?"停止":"播放"))])],1)],1)],1)},staticRenderFns:[]};var U=i("VU/8")(I,L,!1,function(t){i("spB1")},"data-v-50ce54e0",null).exports;g.default.use(_.a);var O=new _.a({routes:[{path:"/",name:"首页",component:k},{path:"/dtmf",name:"DTMF音效",component:G},{path:"/WebAudioAPI",name:"WebAudioAPI实验",component:D},{path:"/MusicBox",name:"音乐盒",component:U}]});O.beforeEach(function(t,e,i){document.title=t.name,i()});var R=O,W=i("8+8L");i("tvR6");g.default.config.productionTip=!1,g.default.use(W.a),g.default.use(C.a),g.default.use(p.a),g.default.use(h.a),g.default.use(f.a),g.default.use(c.a),g.default.use(r.a),g.default.use(s.a),g.default.use(a.a),new g.default({el:"#app",router:R,components:{App:T},template:"<App/>"})},R9Ve:function(t,e){},"X+ky":function(t,e){},Zki6:function(t,e){},ZoaN:function(t,e){},cDSy:function(t,e){},d7TW:function(t,e){},jZDA:function(t,e){},lC8v:function(t,e){},spB1:function(t,e){},tvR6:function(t,e){}},["NHnr"]);