import Vue from 'vue';
import popupContainer from './popupContainer.vue';
export default{
    render(){
        return null;
    },
    props:{
        ref:null
    },
    data(){
        return{
            instance:null
        };
    },
    beforeDestroy(){
        this.destroyPopup();
    },
    methods:{
        createPopup(){
            let instance=new (Vue.extend(popupContainer))({
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
        destroyPopup(){
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