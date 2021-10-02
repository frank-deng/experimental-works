const assert=require('assert');
const pow=require('./50');
describe('pow(x,n)',function(){
    it('2^10',function(){
        assert.strictEqual(pow(2,10),1024);
    });
});

