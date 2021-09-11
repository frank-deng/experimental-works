const assert=require('assert');
const letterCombinations=require('./17');

describe('电话号码的字母组合',function(){
    it('测试1',function(){
        assert.deepStrictEqual(
            letterCombinations('23'),
            [
                'ad',
                'ae',
                'af',
                'bd',
                'be',
                'bf',
                'cd',
                'ce',
                'cf',
            ]
        );
    });
    it('空输入',function(){
        assert.deepStrictEqual(letterCombinations(''),[]);
    });
    it('测试2',function(){
        assert.deepStrictEqual(letterCombinations('2'),['a','b','c']);
    });
});

