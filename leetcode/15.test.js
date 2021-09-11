const assert=require('assert');
const threeSum=require('./15');

describe('三数之和',function(){
    it('[-1,0,1,2,-1,-4]',function(){
        assert.deepStrictEqual(threeSum([-1,0,1,2,-1,-4]), [[-1,-1,2],[-1,0,1]]);
    });
    it('[1,1,-2]',function(){
        assert.deepStrictEqual(threeSum([1,1,-2]), [[-2,1,1]]);
    });
    it('超多的数字',function(){
        threeSum(require('./15.test.json'));
    });
});

