<template>
	<div class="hello">
		<div>
			<el-select multiple v-model='selected' @change='selectionChanged'>
				<el-option v-for='item in selections' :key='item.key' :label='item.label' :value='item.key'></el-option>
			</el-select>
		</div>
		<div>
			<div v-for='item in scores' :key='item.key'>
				<div>{{textTable.selections[item.key]}}</div>
				<el-input v-model='item.value'></el-input>
			</div>
		</div>
		<el-table :data='scores'>
			<el-table-column prop='key' label='名称'>
				<template slot-scope='scope'>{{textTable.selections[scope.row.key]}}</template>
			</el-table-column>
			<el-table-column prop='value' label='值'></el-table-column>
		</el-table>
		<hr/>
		<el-table :data='tableData'>
			<el-table-column v-for='col in this.tableCols' :key='col.prop' :prop='col.prop' :label='col.label'></el-table-column>
		</el-table>
	</div>
</template>
<script src='./DynamicTable.js'></script>
<style scoped>
.el-select{
	width: 100%;
}
</style>
