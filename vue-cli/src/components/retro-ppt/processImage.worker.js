'use strict'
import {getMonochromeImage} from '@/js/monochromeImage.js'
self.addEventListener('message', function(msg){
  self.postMessage(getMonochromeImage(msg.data));
});


