import BoardCell from './cell.vue';
import newLevel from './newLevel.vue';
import gameReport from './gameReport.vue';
export default{
  components:{
    BoardCell,
    newLevel,
    gameReport
  },
  data(){
    return{
      level:null,
      width:null,
      height:null,
      mines:null,
      steps:null,
      board:null,
      status:null,
      startTime:null,
      endTime:null,
      log:[]
    };
  },
  computed:{
    minesMarked(){
      if(!Array.isArray(this.board)){
        return 0;
      }
      let result=0;
      for(let row of this.board){
        for(let cell of row){
          if(cell.mark){
            result++;
          }
        }
      }
      return result;
    }
  },
  watch:{
    status(status){
      if('running'==status){
      }else if('failed'==status || 'success'==status){
        this.endTime=new Date().getTime();
        this.writeLog();
      }
    }
  },
  created(){
    this.readLog();
  },
  methods:{
    readLog(){
      try{
        let logData=localStorage.getItem('minesweeper_log');
        if(!logData){
          return;
        }
        this.log=JSON.parse(logData);
      }catch(e){
        console.error(e);
      }
    },
    writeLog(){
      this.log.push({
        level:this.level,
        width:this.width,
        height:this.height,
        mines:this.mines,
        startTime:this.startTime,
        endTime:this.endTime,
        status:this.status,
        steps:this.steps
      });
      localStorage.setItem('minesweeper_log',JSON.stringify(this.log));
    },
    openGameReport(){
      this.$refs.gameReport.open(this.log);
    },
    restart(){
      this.$refs.newLevel.open().then(resp=>{
        Object.assign(this,{
          level:resp.level,
          width:resp.width,
          height:resp.height,
          mines:resp.mines,
          status:'start',
          startTime:null,
          endTime:null,
          steps:0
        });
        this.createBoard(this.width,this.height);
      })
    },
    createBoard(width,height){
      let board=[];
      for(let row=0; row<height; row++){
        let rowData=[];
        for(let col=0; col<width; col++){
          rowData.push({
            mine:false,
            counter:0,
            dig:false,
            mark:false
          });
        }
        board.push(rowData);
      }
      this.$set(this,'board',board);
      this.status='start';
      this.$forceUpdate();
    },
    initMines(mineCount,y=undefined,x=undefined){
      let rows=this.board.length, cols=this.board[0].length;
      if(mineCount >= rows*cols){
        throw new Error('Too many mines');
      }

      let cellList=[];
      for(let row=0; row<rows; row++){
        for(let col=0; col<cols; col++){
          //跳过被点击的位置
          if(undefined!==x && undefined!==y && y==row && x==col){
            continue;
          }

          cellList.push({
            row,col
          });
        }
      }

      //对坐标列表进行洗牌
      let length=cellList.length;
      for(let i=0; i<length; i++){
        if(Math.random()>0.5){
          continue;
        }
        let j=Math.floor(Math.random()*(length-i-1))+i+1;
        if(cellList[j]){
          let temp=cellList[i];
          cellList[i]=cellList[j];
          cellList[j]=temp;
        }
      }

      //布雷
      for(let i=0; i<mineCount && cellList.length; i++){
        let iCell=Math.floor(Math.random()*(cellList.length-1));
        try{
          let {row,col}=cellList[iCell];
          this.board[row][col].mine=true;
          cellList.splice(iCell,1);
        }catch(e){
          console.error(iCell,cellList.length,cellList[iCell]);
        }
      }

      //标上数字
      for(let row=0; row<rows; row++){
        for(let col=0; col<cols; col++){
          let cell=this.board[row][col];
          cell.counter=this.getNeighbourMineCount(row,col);
        }
      }
    },
    getNeighbours(row0,col0){
      let rows=this.board.length, cols=this.board[0].length;
      let result=[];
      for(let row=row0-1; row<=row0+1; row++){
        for(let col=col0-1; col<=col0+1; col++){
          if(row<0 || row>=(rows) || col<0 || col>=(cols) || (row==row0 && col==col0)){
            continue;
          }
          result.push({
            row,col
          });
        }
      }
      return result;
    },
    getNeighbourMineCount(row0,col0){
      let count=0,row,col;
      for({row,col} of this.getNeighbours(row0,col0)){
        let cell=this.board[row][col];
        if(cell.mine){
          count++;
        }
      }
      return count;
    },
    operate(row,col,e){
      if('start'!=this.status && 'running'!=this.status){
        return;
      }
      let cell=this.board[row][col];

      if(!this.startTime){
        this.startTime=new Date().getTime();
      }

      //不可挖开的方块
      if(cell.mark || cell.dig){
        return;
      }

      this.steps++;

      //标记当前块
      if(e.shiftKey){
        cell.mark=!cell.mark;
        return;
      }
      
      //挖开当前块
      if(!cell.mark){
        this.dig(row,col);
      }

      //处理更多雷
      while('running'==this.status && this.autoproc()){}

      //当前局是否完成
      if('running'==this.status){
        let finished=true;
        for(let row of this.board){
          for(let cell of row){
            if(!cell.mine && !cell.dig){
              finished=false;
              break;
            }
          }
        }
        if(finished){
          this.status='success';
        }
      }
    },
    dig(row,col){
      let cell=this.board[row][col];

      //不可挖开的方块
      if(cell.mark){
        return;
      }

      //第一次挖开
      if('start'==this.status){
        this.initMines(this.mines,row,col);
        this.status='running';
      }

      //挖开该方块
      cell.dig=true;

      //挖到雷
      if(cell.mine){
        this.status='failed';
        return;
      }

      //挖到空格
      if(0==cell.counter){
        let neighbours=this.getNeighbours(row,col);
        neighbours.forEach(({row,col})=>{
          if(!this.board[row][col].dig){
            this.dig(row,col);
          }
        });
      }
    },
    autoproc(){
      let rows=this.board.length, cols=this.board[0].length;
      let further=false;

      //找到周边未挖开块数等于当前块雷数的块，然后把周围块标上
      for(let row=0; row<rows; row++){
        for(let col=0; col<cols; col++){
          let cell=this.board[row][col];
          if(cell.mine || !cell.dig || 0==cell.counter || cell.mark){
            continue;
          }
          let cells=this.getNeighbours(row,col).map(({row,col})=>{
            return this.board[row][col];
          }).filter(cell=>(!cell.dig));
          if(cells.length == cell.counter){
            for(let cell of cells){
              cell.mark=true;
            }
          }
        }
      }

      //找到周边被标记块数等于当前块雷数的块，然后把周围未标记且未挖开的块挖开
      for(let row=0; row<rows; row++){
        for(let col=0; col<cols; col++){
          let cell=this.board[row][col];
          if(cell.mine || !cell.dig || 0==cell.counter || cell.mark){
            continue;
          }

          //当前块周围被标记的块的个数
          let neighbours=this.getNeighbours(row,col), markCount=0;
          neighbours.forEach(({row,col})=>{
            let cell=this.board[row][col];
            if(!cell.dig && cell.mark){
              markCount++;
            }
          });

          //当前块周围被标记的块的个数不等于当前块的雷数
          if(cell.counter!=markCount){
            continue;
          }

          //当前块周围未挖开且未标记的块挖开
          neighbours.forEach(({row,col})=>{
            let cell=this.board[row][col];
            if(!cell.dig && !cell.mark){
              further=true;
              this.dig(row,col);
            }
          });

          //挖到雷了
          if('failed'==this.status){
            return false;
          }
        }
      }

      return further;
    }
  }
}

