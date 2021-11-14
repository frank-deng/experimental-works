const assert=require('assert');
const combinationSum=require('./40');
describe('Combination Sum II',function(){
    it('测试1',function(){
        assert.deepStrictEqual(combinationSum([10,1,2,7,6,1,5],8),[
            [1,1,6],
            [1,2,5],
            [1,7],
            [2,6]
        ]);
    });
    it('测试2',function(){
        assert.deepStrictEqual(combinationSum([2,5,2,1,2],5),[
            [1,2,2],
            [5]
        ]);
    });
});

