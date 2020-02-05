<template>
  <el-dialog
    width='400px'
    :append-to-body='true'
    :center='true'
    :close-on-click-modal='false'
    custom-class='gameReport'
    v-if='display'
    :visible.sync='display'
    title='游戏记录'>
    <table class='dataTable'>
      <tr>
        <th>等级</th>
        <th>总局数</th>
        <th>成功次数</th>
        <th>成功率</th>
        <th>一次成功次数</th>
      </tr>
      <tr>
        <td>初级</td>
        <td>{{logNovice.length}}</td>
        <td>{{noviceSuccess.length}}</td>
        <td>{{noviceSuccessPercent}}</td>
        <td>{{noviceLuck.length}}</td>
      </tr>
      <tr>
        <td>中级</td>
        <td>{{logMedium.length}}</td>
        <td>{{mediumSuccess.length}}</td>
        <td>{{mediumSuccessPercent}}</td>
        <td>{{mediumLuck.length}}</td>
      </tr>
      <tr>
        <td>高级</td>
        <td>{{logExpert.length}}</td>
        <td>{{expertSuccess.length}}</td>
        <td>{{expertSuccessPercent}}</td>
        <td>{{expertLuck.length}}</td>
      </tr>
    </table>
    <template slot='footer'><!--
      --><el-button size='mini' type='primary' @click='exportLog'>导出完整记录</el-button><!--
      --><el-button size='mini' @click='display=false'>返回</el-button><!--
    --></template>
  </el-dialog>
</template>
<style lang='less'>
.gameReport{
  .dataTable{
    border-collapse:collapse;
    th,td{
      text-align:center;
      padding:0 4px;
    }
  }
}
</style>
<script src='./gameReport.js'></script>

