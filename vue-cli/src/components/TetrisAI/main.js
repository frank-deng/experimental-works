var blockMap={
	'O':[
		{w:2,h:2,x:0,y:0,m:0x0f},
	],
	'I':[
		{w:4,h:1,x:2,y:0,m:0x0F},
		{w:1,h:4,x:0,y:2,m:0x0F},
	],
	'Z':[
		{w:2,h:3,x:0,y:1,m:0x2D},
		{w:3,h:2,x:1,y:1,m:0x1E},
	],
	'S':[
		{w:2,h:3,x:0,y:1,m:0x1E},
		{w:3,h:2,x:1,y:1,m:0x33},
	],
	'T':[
		{w:2,h:3,x:0,y:1,m:0x1D},
		{w:3,h:2,x:1,y:1,m:0x3A},
		{w:2,h:3,x:1,y:1,m:0x2E},
		{w:3,h:2,x:1,y:0,m:0x17},
	],
	'L':[
		{w:2,h:3,x:1,y:1,m:0x35},
		{w:3,h:2,x:1,y:0,m:0x3C},
		{w:2,h:3,x:0,y:1,m:0x2B},
		{w:3,h:2,x:1,y:1,m:0x0F},
	],
	'J':[
	],
}
var blockPalette={
	'O':1,
	'I':2,
	'Z':3,
	'S':4,
	'T':5,
	'J':6,
	'L':7,
}
export default{
	data(){
		return{
			board:[],
		};
	},
	methods:{
		drawBlock(type, idx){
		},
	},
	mounted(){
		for(let y=0;y<20;y++){
			let row=[];
			for(let x=0;x<10;x++){
				row.push(0);
			}
			this.board.push(row);
		}
	},
}
