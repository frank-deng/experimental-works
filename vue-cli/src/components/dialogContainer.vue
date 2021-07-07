<template>
    <div class='dialog-container' v-show='visible'><slot></slot></div>
</template>
<style lang="less" scoped>
.dialog-container{
    position:fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
    background: rgba(0,0,0,0.3);
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
