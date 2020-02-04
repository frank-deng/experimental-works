<template>
  <div class='minesweeper-cell' :class='cellClass'>
    <template v-if='"failed"==status'>
      <font-awesome-icon icon='times' class='wrong-mark' v-if='cell.mark && !cell.mine'>X</font-awesome-icon>
      <font-awesome-icon icon='flag' v-else-if='cell.mark && cell.mine'></font-awesome-icon>
      <font-awesome-icon icon='bomb' class='mine' v-else-if='cell.mine'></font-awesome-icon>
      <span v-else-if='cell.dig'>{{cell.counter || ''}}</span>
    </template>
    <template v-else>
      <font-awesome-icon icon='flag' v-if='cell.mark'></font-awesome-icon>
      <span v-else-if='cell.dig'>{{cell.counter || ''}}</span>
    </template>
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
  width:20px;
  height:20px;
  line-height:20px;
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
    cell(){
      return this.value;
    },
    cellClass(){
      return{
        active:('start'==this.status||'running'==this.status),
        undig:!this.value.dig
      }
    }
  }
}
</script>

