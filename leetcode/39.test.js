const assert=require('assert');
const combinationSum=require('./39');
describe('Combination Sum',function(){
    it('测试1',function(){
        assert.deepStrictEqual(combinationSum([2,3,6,7],7),[
            [2,2,3],
            [7]
        ]);
    });
    it('测试2',function(){
        assert.deepStrictEqual(combinationSum([2,3,5],8),[
            [2,2,2,2],
            [2,3,3],
            [3,5]
        ]);
    });
});

