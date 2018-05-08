async function testSync(){
	const response = await new Promise((resolve) =>{
		setTimeout(()=>{
			resolve('Miao~~~');
		}, 1000);
	});
	console.log(response);
}
testSync();
