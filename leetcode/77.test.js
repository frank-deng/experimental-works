const assert=require('assert');
const Combination=require('./77');
describe('组合',function(){
    it('测试1',function(){
        let result=[];
        for(let item of new Combination(3,2)){
            result.push(item);
        }
        assert.deepStrictEqual(result,[
            [0,1],[0,2],[1,2]
        ]);
    });
    it('测试2',function(){
        let result=[];
        for(let item of new Combination(4,2)){
            result.push(item);
        }
        assert.deepStrictEqual(result,[
            [0,1],[0,2],[0,3],[1,2],[1,3],[2,3]
        ]);
    });
});
