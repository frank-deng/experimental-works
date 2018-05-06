function calcReturn(things) {
	console.log('calcReturn: ' + things);
	return things;
}
function test(error, ret0, ret1, ret2){
	try{
		console.log('Processing...');
		if (error) {
			throw new Error('Oops~');
		}
		if (ret0) {
			return calcReturn('normal');
		}
	} catch(e) {
		console.log('Error: '+e.message);
		if (ret1) {
			return calcReturn(e.message);
		}
	} finally {
		console.log('Finishing...');
		if (ret2) {
			return calcReturn('finish');
		}
	}
	return 'ok';
}
var conditions = [
	[false, false, false, false],
	[false, false, false, true],
	[false, false, true, false],
	[false, false, true, true],
	[false, true, false, false],
	[false, true, false, true],
	[false, true, true, false],
	[false, true, true, true],
	[true, false, false, false],
	[true, false, false, true],
	[true, false, true, false],
	[true, false, true, true],
	[true, true, false, false],
	[true, true, false, true],
	[true, true, true, false],
	[true, true, true, true],
];
for (var i = 0; i < conditions.length; i++){
	var cond = conditions[i];

	console.log('Throw Error: ' + (cond[0] ? 'Yes' : 'No'));
	console.log('Return in try: ' + (cond[1] ? 'Yes' : 'No'));
	console.log('Return in catch: ' + (cond[2] ? 'Yes' : 'No'));
	console.log('Return in finally: ' + (cond[3] ? 'Yes' : 'No'));

	console.log('Return: ' + test(cond[0], cond[1], cond[2], cond[3]));
	console.log('');
}

