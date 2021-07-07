<template>
    <div class='dialog-container'
        ref='dialogContainer'
        v-show='this.visible'>
        <slot v-if='this.visible || !this.destroyOnClose'></slot>
    </div>
</template>
<script>
export default {
    props:{
        visible:{
            type:Boolean,
            default:false
        },
        destroyOnClose:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            container:null
        };
    },
    watch:{
        visible(visible){
            if(visible && !this.container){
                this.$nextTick().then(()=>{
                    this.container=this.$refs.dialogContainer;
                    document.body.appendChild(this.container);
                });
            }
        }
    },
    beforeDestroy(){
        if(this.container){
            document.body.removeChild(this.container);
            this.container=null;
        }
    }
}
</script>
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
