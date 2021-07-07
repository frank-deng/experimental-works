<template>
    <span class='tooltip' ref='tooltipBody'>
        <slot></slot>
        <div class='tooltip-content' ref='tooltipContent'></div>
    </span>
</template>
<style lang="less" scoped>
.tooltip{
    position: fixed;
    left:0;
    top:0;
    background:#ff00ff;
}
</style>
<script>
export default{
    mounted(){
        document.body.appendChild(this.$refs.tooltipContent);
    },
    beforeDestroy(){
        document.body.removeChild(this.$refs.tooltipContent);
    }
}
</script>
