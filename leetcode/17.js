class RadixCycle{
    constructor(counter=[]){
        //Check input first
        if(!Array.isArray(counter)){
            throw TypeError('array required');
        }
        this.maxCount=[];
        for(let item of counter){
            if(isNaN(item) || null===item){
                throw TypeError('array contains null or non-number value.');
            }
            this.maxCount.push(Number(item));
        }
        //Prepare data
        this.reset();
    }
    reset(){
        this.counter=new Array(this.maxCount.length).fill(0);
    }
    [Symbol.iterator](){
        return this;
    }
    next(){
        if(!this.maxCount.length || this.counter[0]>=this.maxCount[0]){
            this.reset();
            return{done:true};
        }
        let value=this.counter.slice();
        for(let i=this.maxCount.length-1; i>=0; i--){
            this.counter[i]++;
            if(i && this.counter[i]>=this.maxCount[i]){
                this.counter[i]=0;
            }else{
                break;
            }
        }
        return{value};
    }
}
const NUM_LETTERS_TABLE={
    '2':'abc',
    '3':'def',
    '4':'ghi',
    '5':'jkl',
    '6':'mno',
    '7':'pqrs',
    '8':'tuv',
    '9':'wxyz'
};
module.exports=function(input){
    let counterArray=[], digitArray=[], result=[];
    for(let i=0; i<input.length; i++){
        let ch=input.charAt(i), letterTable=NUM_LETTERS_TABLE[ch];
        if(!letterTable){
            continue;
        }
        digitArray.push(letterTable);
        counterArray.push(letterTable.length);
    }
    for(let comb of new RadixCycle(counterArray)){
        let combLetters='';
        let idx=0;
        for(let item of comb){
            combLetters+=digitArray[idx].charAt(item);
            idx++;
        }
        result.push(combLetters);
    }
    return result;
}

