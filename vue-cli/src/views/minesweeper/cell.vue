<template>
  <div class='minesweeper-cell' :class='cellClass'>
    <span v-show='!value.mine && value.dig'>{{value.counter || ''}}</span>
    <font-awesome-icon icon='times' class='wrong-mark' v-show='wrongMark'></font-awesome-icon>
    <font-awesome-icon icon='flag' v-show='showMark'></font-awesome-icon>
    <font-awesome-icon icon='bomb' class='mine' v-show='showMine && value.mine && !value.mark'></font-awesome-icon>
  </div>
</template>
<style scoped lang='less'>
.font-awesome-icon{
  display:inline-block;
  width:14px;
  height:14px;
}
.minesweeper-cell{
  overflow:hidden;
  width:30px;
  height:30px;
  line-height:30px;
  font-size:14px;
  vertical-align:middle;
  text-align:center;
  border:1px solid #eeeeee;
}
.minesweeper-cell.active{
  cursor:pointer;
}
.minesweeper-cell.undig{
  background-color:rgba(128,128,128,0.5);
}
.minesweeper-cell{
  .mine,.wrong-mark{
    color:#ff0000;
  }
}
.minesweeper-cell.undig{
  .mine{
    color:#000000;
  }
}
.minesweeper-cell.undig.active:hover{
  background-color:#dddddd;
}
</style>
<script>
export default{
  props:{
    value:null,
    status:null
  },
  computed:{
    cellClass(){
      return{
        active:('start'==this.status||'running'==this.status),
        undig:!this.value.dig
      }
    },
    showMine(){
      return 'failed'==this.status;
    },
    showMark(){
      return !this.value.dig && this.value.mark && !this.wrongMark;
    },
    wrongMark(){
      return !this.value.dig && this.showMine && this.value.mark && !this.value.mine;
    }
  }
}
</script>

