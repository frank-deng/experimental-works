import fecha from 'fecha';
import {saveAs} from 'file-saver';
export default{
  data(){
    return{
      display:false,
      log:[]
    };
  },
  computed:{
    logNovice(){
      return this.log.filter(item=>('novice'==item.level));
    },
    logMedium(){
      return this.log.filter(item=>('medium'==item.level));
    },
    logExpert(){
      return this.log.filter(item=>('expert'==item.level));
    },
    noviceSuccess(){
      return this.logNovice.filter(item=>('success'==item.status));
    },
    mediumSuccess(){
      return this.logMedium.filter(item=>('success'==item.status));
    },
    expertSuccess(){
      return this.logExpert.filter(item=>('success'==item.status));
    },
    noviceLuck(){
      return this.noviceSuccess.filter(item=>(1==item.steps));
    },
    mediumLuck(){
      return this.mediumSuccess.filter(item=>(1==item.steps));
    },
    expertLuck(){
      return this.expertSuccess.filter(item=>(1==item.steps));
    },
    noviceSuccessPercent(){
      if(!this.logNovice.length){
        return 'N/A';
      }
      return (100*this.noviceSuccess.length/this.logNovice.length).toFixed(2)+'%';
    },
    mediumSuccessPercent(){
      if(!this.logMedium.length){
        return 'N/A';
      }
      return (100*this.mediumSuccess.length/this.logMedium.length).toFixed(2)+'%';
    },
    expertSuccessPercent(){
      if(!this.logExpert.length){
        return 'N/A';
      }
      return (100*this.expertSuccess.length/this.logExpert.length).toFixed(2)+'%';
    }
  },
  methods:{
    open(logData){
      this.log=logData.slice();
      this.display=true;
    },
    exportLog(){
      let lines=[
        '"Level","Start Time","Time Elapsed","Steps","Success"'
      ]
      for(let line of this.log){
        if('custom'==line.level){
          continue;
        }
        let startTime='', elapsedSeconds='', statusText=('success'==line.status ? 'Y' : 'N');
        if(line.startTime && line.endTime){
          startTime=fecha.format(line.startTime,'YYYY-MM-DD HH:mm:ss');
          startTime=`"${startTime}"`;
          elapsedSeconds=Math.round((line.endTime-line.startTime)/1000);
        }
        lines.push(`"${line.level}",${startTime},${elapsedSeconds},${line.steps},${statusText}`);
      }
      saveAs(new Blob([lines.join('\r\n')]),'minesweeper.csv');
    }
  }
}

