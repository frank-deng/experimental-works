//把目录结构保存成JSON，像数据库一样存储

const uuid=require('uuid').v4;
const {readdir}=require('fs').promises;
const path=require('path');
const dir=path.resolve(process.argv[2]);

class TreeDataGen{
    data=[];
    constructor(dir){
        this.dir=dir;
    }
    async readSubDir(dir=this.dir,parent=null){
        for(let item of await readdir(dir,{
            withFileTypes:true
        })){
            let id=uuid();
            this.data.push({
                id,
                parent,
                name:item.name
            });
            if(item.isDirectory()){
                await this.readSubDir(path.resolve(dir,item.name),id);
            }
        }
    }
    get(){
        return this.data;
    }
}
async function main(){
    let treeDataGen=new TreeDataGen(dir);
    await treeDataGen.readSubDir();
    process.stdout.write(JSON.stringify(treeDataGen.get(),null,2));
    return 0;
}
main().then((ret)=>{
    process.exit(ret);
});
