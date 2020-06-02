import React, {useEffect, useState} from 'react';

const SpeechWithRecorderAudio = (props) => {
  //let mediaRecorder;
  let shouldStop = false;
  let stopped = false;  
  const [mediaRecorder, setMediaRecorder] = useState(); 
  const [recordedChunks, setRecordedChunks] = useState([]);

 const handleSuccess = (stream) => {  
    console.log(stream);
    
    
    const options = { 
      mimeType: 'audio/webm',
      audioBitsPerSecond : 44100,
      bitsPerSecond: 8,
    };
    stream = new MediaRecorder(stream, options);
    //stream.setAudioSource(MediaRecorder.AudioSource.MIC);
    //stream.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
    //stream.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
    //stream.setAudioEncodingBitRate(16);
    //stream.setAudioSamplingRate(44100);

    console.log('output',mediaRecorder);

    stream.ondataavailable = (e) => {
      console.log('DATA', e.data);
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
      setRecordedChunks(recordedChunks);

      if(shouldStop === true && stopped === false) {
        mediaRecorder.stop();
        stopped = true;
      }
    };

    stream.onstop = (e) => {
      // downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
      // downloadLink.download = 'acetest.wav';
      console.log('stop', e);
      const audioBlob = new Blob(recordedChunks);
      console.log('audioBlob', audioBlob);
    };

    stream.onresume = (e) => {
      console.log('onresume', e);
    };

    stream.onstart = (e) => {
      console.log('onstart', e);
    };

    stream.onpause = (e) => {
      console.log('onpause', e);
    };

    stream.onerror = (e) => {
      console.log('onerror', e);
    };

    setMediaRecorder(stream);

    
  };

  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
    .then(handleSuccess)
    .catch(function(err) {
      console.log('ERRO', err);
    }); 
    console.log('mount');
  },[]);

  useEffect(()=>{
    console.log('eff', mediaRecorder);
    if(mediaRecorder && mediaRecorder.state != 'recording'){
      mediaRecorder.start(5000);
      console.log(mediaRecorder.state);
      setTimeout(event => {
        console.log("stopping");
        mediaRecorder.stop();
      }, 9000);
    }      
  },[mediaRecorder]);

  useEffect(()=>{
    console.log('recordedChunks', recordedChunks);


      
  },[recordedChunks]);

  return (<div>Recorder Audio</div>);
}

export default SpeechWithRecorderAudio;