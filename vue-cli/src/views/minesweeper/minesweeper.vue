<template>
  <div class='minesweeper' oncontextmenu='return false'>
    <div class='board-container' v-if='board'>
      <div class='board-row' v-for='(rowData,row) of board'>
        <div class='board-cell' v-for='(cell,col) of rowData'
          :class='{undig:!cell.dig}'
          @click.stop='operate(row,col,$event)'>
          {{displayText(cell)}}
        </div>
      </div>
    </div>
    <el-button @click='restart'>重新开始</el-button>
    {{status}}
  </div>
</template>
<style scoped lang='less'>
.board-container{
  user-select:none;
  margin:0 auto;
  display:table;
  .board-row{
    display:table-row;
  }
  .board-cell{
    display:table-cell;
    width:20px;
    height:20px;
    line-height:20px;
    vertical-align:middle;
    text-align:center;
    border:1px solid #eeeeee;
    cursor:pointer;
  }
  .board-cell.undig{
    background-color:#dddddd;
  }
  .board-cell:hover{
    background-color:rgba(128,128,128,0.5);
  }
}
</style>
<script src='./minesweeper.js'></script>

