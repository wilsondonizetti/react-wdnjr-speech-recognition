import React, {useEffect} from 'react';

const SpeechWithRecorderAudio = (props) => {
  //let mediaRecorder;
  let shouldStop = false;
  let stopped = false;  
 const handleSuccess = (stream) => {  
    console.log(stream);

    const options = {mimeType: 'video/webm;codecs=vp9'};
    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, options);  

    mediaRecorder.ondataavailable = e => {
      console.log('DATA', e);
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }

      if(shouldStop === true && stopped === false) {
        mediaRecorder.stop();
        stopped = true;
      }
    };

    mediaRecorder.onstop = (e) => {
      // downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
      // downloadLink.download = 'acetest.wav';
      console.log('stop', e);
    };

    mediaRecorder.start();
    console.log(mediaRecorder.state);
  };
  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
    .then(handleSuccess)
    .catch(function(err) {
      console.log('ERRO', err);
    }); 
    console.log('mount');
  },[]);

  return (<div>Recorder Audio</div>);
}

export default SpeechWithRecorderAudio;