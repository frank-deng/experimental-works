<template>
  <div class='minesweeper' oncontextmenu='return false'>
    <div class='toolbox'>
      <el-button type='primary' size='mini' @click='restart'>重新开始</el-button>
      步数：{{steps}}
    </div>
    <div class='board-container' v-if='board'>
      <div class='board-row' v-for='(rowData,row) of board'>
        <BoardCell class='board-cell' v-for='(cell,col) of rowData'
          :value='cell' :status='status'
          @click.native.stop='operate(row,col,$event)'></BoardCell>
      </div>
    </div>
  </div>
</template>
<style scoped lang='less'>
.minesweeper{
  .toolbox{
    text-align:center;
    margin-bottom:10px;
  }
  .board-container{
    user-select:none;
    margin:0 auto;
    display:table;
    .board-row{
      display:table-row;
    }
    .board-cell{
      display:table-cell;
    }
  }
}
</style>
<script src='./minesweeper.js'></script>

