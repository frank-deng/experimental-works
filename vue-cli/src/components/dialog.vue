<script>
export default {
    render(h){
        if(!this.initialized){
            return null;
        }
        return h('div',{
            ref:'dialogContainer',
            class:{
                'dialog-container':true
            },
            style:{
                display:this.visible ? 'block' : 'none'
            }
        }, !this.visible && this.destroyOnClose ? null : this.$slots.default);
    },
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
            initialized:false
        };
    },
    watch:{
        visible(visible){
            if(visible && !this.initialized){
                this.initialized=true;
                this.$nextTick().then(()=>{
                    document.body.appendChild(this.$refs.dialogContainer);
                });
            }
        }
    },
    beforeDestroy(){
        if(this.initialized){
            document.body.removeChild(this.$refs.dialogContainer);
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
