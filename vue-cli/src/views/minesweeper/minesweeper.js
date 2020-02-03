export default{
  data(){
    return{
      board:null,
      status:'start'
    };
  },
  created(){
    this.restart();
  },
  methods:{
    restart(){
      this.createBoard(16,16);
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
        let j=Math.floor(Math.random()*(length-i-1)+i+1);
        let temp=cellList[i];
        cellList[i]=cellList[j];
        cellList[j]=temp;
      }

      //布雷
      for(let i=0; i<mineCount; i++){
        let iCell=Math.round(Math.random()*(cellList.length-1));
        let {row,col}=cellList[iCell];
        this.board[row][col].mine=true;
        cellList.splice(iCell,1);
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
    displayText(cell){
      if(cell.mark){
        return '旗';
      }
      if(!cell.dig && ('running'==this.status || 'start'==this.status)){
        return '';
      }
      if(cell.mine){
        return '雷';
      }
      if(cell.counter>0){
        return cell.counter;
      }
    },
    operate(row,col,e){
      if('start'!=this.status && 'running'!=this.status){
        return;
      }

      let cell=this.board[row][col];
      if(e.shiftKey){
        cell.mark=!cell.mark;
      }else if(!cell.mark){
        this.dig(row,col);
      }

      if('running'==this.status){
        //处理更多雷
        while(this.autoproc()){}

        //当前局是否完成
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
      if(cell.mark){
        return;
      }

      //第一次挖开
      if('start'==this.status){
        this.initMines(40,row,col);
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
        }
      }

      return further;
    }
  }
}

