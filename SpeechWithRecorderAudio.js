import React, {useEffect, useState} from 'react';

const SpeechWithRecorderAudio = (props) => {
  //let mediaRecorder;
  const [shouldStop, setShouldStop] = useState(false);
  const [stopped, setStopped] = useState(false);  
  const [mediaRecorder, setMediaRecorder] = useState(null); 
  const [recordedChunks, setRecordedChunks] = useState([]);

  const playAudio = (dados) =>{
    const blob = new Blob(dados);
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = () => {
      const base64data = reader.result;
      console.log('base64data', base64data);
      console.log('recordedChunks', dados);

      if (navigator.userAgent === 'logisticspwa') {
        const msg = { messageType: 'playsound', value: base64data };
        window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      } else {
        const audio = new Audio(URL.createObjectURL(blob));
        audio.autoplay = false;
        audio.oncanplay = (ev) => {
            ev.currentTarget.play().then(() => {
                console.log('play');
            });
        };
      }
    };    
  };

 const handleSuccess = (stream) => {          
    const options = { 
      mimeType: 'audio/webm',
      audioBitsPerSecond : 44100,
      bitsPerSecond: 8,
    };
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (e) => {
      //console.log('DATA', e.data);
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
        //setRecordedChunks(recordedChunks);        
        //console.log('DATA size', e.data.size);
        //console.log('DATA state', mediaRecorder.state);         
      }
      
      //playAudio();
      //setTimeout(()=>{playAudio();}, 3000);
      if(shouldStop === true && stopped === false) {
        mediaRecorder.stop();
        stopped = true;
      }
    };

    mediaRecorder.onstop = (e) => {
      // downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
      // downloadLink.download = 'acetest.wav';
      //mediaRecorder.start(5000);
      mediaRecorder.start();
      console.log('stop', e);      
    };

    mediaRecorder.onresume = (e) => {
      console.log('onresume', e);
    };

    mediaRecorder.onstart = (e) => {
      console.log('onstart', e);
    };

    mediaRecorder.onpause = (e) => {
      console.log('onpause', e);
    };

    mediaRecorder.onerror = (e) => {
      console.log('onerror', e);
    };

    setMediaRecorder(mediaRecorder);
    mediaRecorder.start();
    setTimeout(() => {
      recognize();    
    }, 5000);    
  };

  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
    .then(handleSuccess)
    .catch((err)=> {
      console.log('ERRO', err);
    }); 
    console.log('mount');
  },[]);

  useEffect(()=>{
    console.log('eff', mediaRecorder);
    if(mediaRecorder && mediaRecorder.state != 'recording'){
      //mediaRecorder.start(5000);
      //console.log(mediaRecorder.state);
      // setTimeout(event => {
      //   //console.log("stopping");
      //   //mediaRecorder.stop();
      //   //setRecordedChunks([]);
      //   //mediaRecorder.start(5000);
      // }, 5000);
    }      
  },[mediaRecorder]);

  // useEffect(()=>{
  //   console.log('recordedChunks', recordedChunks);
  // },[recordedChunks]);

  const recognize = () => {
    console.log('recognize', mediaRecorder.state);
    mediaRecorder.stop();
    const dados = recordedChunks;
    console.log('dados', dados);
    playAudio(dados);
    recordedChunks = [];

    setTimeout(() => {
      recognize();    
    }, 5000); 
  }

  return (<div>Recorder Audio</div>);
}

export default SpeechWithRecorderAudio;