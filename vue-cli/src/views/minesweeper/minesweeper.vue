<template>
  <div class='minesweeper' oncontextmenu='return false'>
    <div class='toolbox'>
      <el-button-group>
        <el-button type='primary' size='mini' @click='restart("novice")'>初级</el-button>
        <el-button type='primary' size='mini' @click='restart("medium")'>中级</el-button>
        <el-button type='primary' size='mini' @click='restart("expert")'>高级</el-button>
        <el-button type='primary' size='mini' @click='restart("custom")'>自定义</el-button>
      </el-button-group>
      步数：{{steps}}
      {{minesMarked}}/{{mines}}
    </div>
    <div class='board-container' v-if='board'>
      <div class='board-row' v-for='(rowData,row) of board'>
        <div class='board-cell' v-for='(cell,col) of rowData'>
          <BoardCell :value='cell' :status='status'
            @click.native.stop='operate(row,col,$event)'></BoardCell>
        </div>
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
    table-layout:fixed;
    .board-row{
      display:table-row;
    }
    .board-cell{
      display:table-cell;
    }
    .minesweeper-cell{
      display:inline-block;
      vertical-align:top;
    }
  }
}
</style>
<script src='./minesweeper.js'></script>

