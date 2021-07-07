<template>
    <div class='popup-container'><slot></slot></div>
</template>
<style lang="less" scoped>
.popup-container{
    position:fixed;
}
</style>
<script>
export default {
    props:{
        visible:{
            type:Boolean,
            default:false
        }
    }
}
</script>
