<script>
import Vue from 'vue';
import dialogContainer from './dialogContainer.vue';
export default {
    render(){
        return null
    },
    props:{
        visible:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            instance:null
        };
    },
    watch:{
        visible(visible){
            if(!this.instance){
                return;
            }
            this.instance.visible=visible;
        }
    },
    created(){
        let instance=new (Vue.extend(dialogContainer))({
            propsData:{
                visible:this.visible
            }
        });
        instance.$slots=this.$slots;
        instance.$scopedSlots=this.$scopedSlots;
        instance.$mount();
        this.instance=instance;
        document.body.appendChild(instance.$el);
    },
    beforeDestroy(){
        if(this.instance){
            let element=this.instance.$el;
            this.instance.$destroy();
            this.instance=null;
            document.body.removeChild(element);
        }
    }
}
</script>