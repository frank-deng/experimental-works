var myObj = function(init0){
	var init = init0;
	myObj.prototype.getVal = function(){
		return init;
	}
}
var a = new myObj('hahaha');
var b = new myObj('Frank!!!');
console.log(a.getVal());
console.log(b.getVal());

