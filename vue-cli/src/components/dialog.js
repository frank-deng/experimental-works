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
        },
        destroyOnClose:{
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
            if(!visible){
                if(this.destroyOnClose){
                    this.destroyInstance();
                }else{
                    this.instance.visible=visible;
                }
            }else{
                if(!this.instance){
                    this.createInstance(visible);
                }else{
                    this.instance.visible=visible;
                }
            }
        }
    },
    beforeDestroy(){
        this.destroyInstance();
    },
    methods:{
        createInstance(visible){
            let instance=new (Vue.extend(dialogContainer))({
                propsData:{
                    visible
                }
            });
            instance.$slots=this.$slots;
            instance.$scopedSlots=this.$scopedSlots;
            instance.$mount();
            this.instance=instance;
            document.body.appendChild(instance.$el);
        },
        destroyInstance(){
            if(!this.instance){
                return;
            }
            let element=this.instance.$el;
            this.instance.$destroy();
            this.instance=null;
            document.body.removeChild(element);
        }
    }
}