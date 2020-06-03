import React, {useEffect, useState} from 'react';

const SpeechWithRecorderAudio = (props) => {
  const [shouldStop, setShouldStop] = useState(false);
  const [stopped, setStopped] = useState(false);  
  const [mediaRecorder, setMediaRecorder] = useState(null); 
  const [recordedChunks, setRecordedChunks] = useState([]);

  const playAudio = (dados) =>{
    const blob = new Blob(dados, { type: 'audio/webm' });
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
      audioBitsPerSecond : 128000 //44100
    };
    mediaRecorder = new window.MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);     
      }
    };

    mediaRecorder.onstop = (e) => {
      // downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
      // downloadLink.download = 'acetest.wav';
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
    }, 2000);    
  };

  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
    .then(handleSuccess)
    .catch((err)=> {
      console.log('ERRO', err);
    }); 
  },[]);

  const recognize = () => {
    mediaRecorder.stop();
    const dados = recordedChunks;
    playAudio(dados);
    recordedChunks = [];

    setTimeout(() => {
      recognize();    
    }, 2000); 
  }

  return (<div>Recorder Audio</div>);
}

export default SpeechWithRecorderAudio;