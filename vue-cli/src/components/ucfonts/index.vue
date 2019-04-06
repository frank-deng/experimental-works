<template>
  <div class='ucfonts'>
    <el-form label-width='80px' :inline='true' size='mini'>
      <el-form-item label='文字'>
        <el-input type='text' v-model='textInput'></el-input>
      </el-form-item>
      <el-form-item label='英文字体'>
        <el-select type='text' v-model='ascFont'>
          <el-option v-for='i of 10' :key='i-1' :value='i-1' :label="'字体'+i" @change='$refs.charData.update()'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='宽度'>
        <el-input-number type='text' v-model='width'></el-input-number>
      </el-form-item>
      <el-form-item label='高度'>
        <el-input-number type='text' v-model='height'></el-input-number>
      </el-form-item>
      <el-form-item label='X'>
        <el-input-number type='text' v-model='x'></el-input-number>
      </el-form-item>
      <el-form-item label='Y'>
        <el-input-number type='text' v-model='y'></el-input-number>
      </el-form-item>
    </el-form>
    <charData ref='charData' :fontData='fontDataChar' :width='width' :height='height' :x='x' :y='y'></charData>
  </div>
</template>
<script src='./index.js'></script>
