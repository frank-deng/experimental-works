<template>
  <div class='minesweeper' oncontextmenu='return false'>
    <div class='toolbox'><!--
      --><el-button type='primary' size='mini' @click='restart'>新游戏</el-button><!--
      --><el-button size='mini' @click='openGameReport'>游戏记录</el-button><!--
      --><template v-if='board'><!--
        --><div class='steps'>步数：{{steps}}</div><!--
        --><div class='mines'>{{minesMarked}}/{{mines}}</div><!--
        --><div class='success' v-if='"success"==status'>成功了</div><!--
        --><div class='failed' v-else-if='"failed"==status'>失败了</div><!--
        --><div class='statusSpacer' v-else></div><!--
      --></template><!--
    --></div>
    <div class='board-container' v-if='board'>
      <div class='board-row' v-for='(rowData,row) of board'>
        <div class='board-cell' v-for='(cell,col) of rowData'>
          <BoardCell :value='cell' :status='status'
            @click.native.stop='operate(row,col,$event)'></BoardCell>
        </div>
      </div>
    </div>
    <div class='hint'>本页面使用LocalStorage存储您的游戏记录，包括开始时间、结束时间、步数、是否成功。</div>
    <newLevel ref='newLevel'></newLevel>
    <gameReport ref='gameReport'></gameReport>
  </div>
</template>
<style scoped lang='less'>
.minesweeper{
  .toolbox{
    text-align:center;
    margin-bottom:10px;
    .steps,
    .mines,
    .success,
    .failed,
    .statusSpacer{
      width:60px;
      line-height:28px;
      display:inline-block;
      vertical-align:top;
      font-size:14px;
    }
    .steps{
      width:100px;
    }
    .success{
      color:#00cc00;
    }
    .failed{
      color:#cc0000;
    }
  }
  .board-container{
    user-select:none;
    margin:0 auto 10px auto;
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
  .hint{
    text-align:center;
    font-size:12px;
    line-height:16px;
    color:#aaaaaa;
  }
}
</style>
<script src='./minesweeper.js'></script>

