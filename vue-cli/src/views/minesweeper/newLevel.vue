<template>
  <el-dialog
    v-if='display'
    :visible.sync='display'
    title='新游戏'
    :center='true'
    :close-on-click-modal='false'
    custom-class='dialogMinesweeperNewGame'
    width='320px'
    :append-to-body='true'>
    <el-form size='mini' label-width='40px'>
      <el-form-item label='难度'>
        <el-radio-group v-model='formData.level'>
          <el-radio label='novice'>初级</el-radio>
          <el-radio label='medium'>中级</el-radio>
          <el-radio label='expert'>高级</el-radio>
          <el-radio label='custom'>自定义</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if='customLevel'>
        <el-form-item label='宽度'>
          <el-input-number v-model='formData.width' :precision='0' :min='4' :max='32' @change='updateMines'></el-input-number>
        </el-form-item>
        <el-form-item label='高度'>
          <el-input-number v-model='formData.height' :precision='0' :min='4' :max='32' @change='updateMines'></el-input-number>
        </el-form-item>
        <el-form-item label='雷数'>
          <el-input-number v-model='formData.mines' :precision='0' :min='1' :max='maxMines'></el-input-number>
        </el-form-item>
      </template>
    </el-form>
    <template slot='footer'>
      <el-button type='primary' size='mini' @click='submit'>新游戏</el-button>
    </template>
  </el-dialog>
</template>
<style lang='less'>
.dialogMinesweeperNewGame{
  .el-dialog__body{
    padding-top:0;
    padding-bottom:0;
  }
  .el-radio{
    line-height:28px;
    margin-right:20px;
  }
}
</style>
<script src='./newLevel.js'></script>

