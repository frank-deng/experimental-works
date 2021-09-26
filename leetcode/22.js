class GenerateParentheses{
    constructor(count){
        this.count=count;
    }
    __checkBrackets(data){
        let check=0;
        for(let item of data){
            if('('==item){
                check++;
            }
            if(')'==item){
                check--;
            }
            if(check<0){
                return false;
            }
        }
        return !check;
    }
    __proc(data='',lCount=0,rCount=0){
        //Left bracket
        if(lCount<this.count){
            this.__proc(data+'(',lCount+1,rCount);
        }

        //Right bracket
        if(rCount<this.count){
            this.__proc(data+')',lCount,rCount+1);
        }else if(this.__checkBrackets(data)){
            this.result.push(data);
        }
    }
    run(){
        this.result=[];
        this.__proc('(',1,0);
        return this.result;
    }
}
module.exports=function(n){
    return new GenerateParentheses(n).run();
}
