export default{
  components:{
    drawPad:require('./DrawPad.vue').default,
  },
  methods:{
    clearDrawPad(){
      this.$refs.drawPad.clear();
    },
  },
}
