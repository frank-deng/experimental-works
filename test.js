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

function abc(){
	try{
		jskhdb();
		return '$hahaha';
	} catch(e) {
		console.log('oops');
		return '$oops';
	} finally {
		console.log('finished');
		//return '$finished';
	}
	return 1;
}
console.log(abc());