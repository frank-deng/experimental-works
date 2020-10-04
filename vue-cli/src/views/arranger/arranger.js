export default{
  data(){
    return{
      tasks:[
        {
          id:'出门',
          name:'出门',
          dep:['吃饭','放饭盒']
        },
        {
          id:'刷牙',
          name:'刷牙'
        },
        {
          id:'放饭盒',
          name:'放饭盒'
        },
        {
          id:'吃饭',
          name:'吃饭',
          dep:['刷牙','洗脸','热牛奶','烤面包']
        },
        {
          id:'烤面包',
          name:'烤面包'
        },
        {
          id:'热牛奶',
          name:'热牛奶'
        },
        {
          id:'洗脸',
          name:'洗脸',
          dep:['刷牙']
        }
      ]
    };
  },
  computed:{
    taskTable(){
      let result={};
      for(let task of this.tasks){
        result[task.id]=task;
      }
      return result;
    },
    arrangedResult(){
      let result=[], depTable={}, visitedTasks={};
      //依赖表备份一份
      for(let task of this.tasks){
        depTable[task.id]={};
        if(!Array.isArray(task.dep)){
          continue;
        }
        for(let dep of task.dep){
          depTable[task.id][dep]=true;
        }
      }

      //处理数据
      let foundTaskToProcess=true, count=1000;
      while(foundTaskToProcess && --count){
        foundTaskToProcess=false;
        for(let task of this.tasks){
          let id=task.id;
          if(visitedTasks[id] || Object.keys(depTable[id]).length){
            continue;
          }

          foundTaskToProcess=true;
          result.push(task);
          visitedTasks[id]=true;
          for(let depTableItem of Object.values(depTable)){
            if(depTableItem[id]){
              delete depTableItem[id];
            }
          }
        }
      }
      if(count<=0){
        console.error('死循环');
      }

      //检测是否有循环依赖
      for(let depTableItem of Object.values(depTable)){
        if(Object.keys(depTableItem).length){
          throw new Error('有循环依赖');
        }
      }

      return result;
    }
  }
}

