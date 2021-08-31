class Tree{
    __tree=[];
    __root=Symbol();
    constructor(data){
        //把所有节点数据按父id分组，包括根节点
        let parentTable={};
        for(let item of data){
            let parentKey=item.parent || this.__root;
            if(!Array.isArray(parentTable[parentKey])){
                parentTable[parentKey]=[];
            }
            parentTable[parentKey].push(item);
        }
        this.__data=parentTable;
        this.__tree=this.__genTree(this.__root);
    }
    __genTree(parent){
        let result=[];
        for(let item of this.__data[parent]){
            let itemNew={
                ...item
            };
            //找当前项目是否有子项目
            if(this.__data[item.id]){
                itemNew.children=this.__genTree(item.id);
            }
            delete itemNew.parent;
            result.push(itemNew);
        }
        return result;
    }
    get(){
        return this.__tree;
    }
}

async function main(){
    const tree=new Tree(require(process.argv[2]));
    process.stdout.write(JSON.stringify(tree.get(),null,2));
    return 0;
}
main().then((ret)=>{
    process.exit(ret);
});
