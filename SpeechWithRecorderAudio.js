import React, {useEffect, useState} from 'react';

const SpeechWithRecorderAudio = (props) => {
  const [shouldStop, setShouldStop] = useState(false);
  const [stopped, setStopped] = useState(false);  
  const [mediaRecorder, setMediaRecorder] = useState(null); 
  const [recordedChunks, setRecordedChunks] = useState([]);
  let extension = 'webm';

  const playAudio = (blob) =>{    
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = () => {
      const base64data = reader.result;
      console.log('base64data', base64data);
        const audio = new Audio(URL.createObjectURL(blob));
        audio.autoplay = false;
        audio.oncanplay = (ev) => {
            ev.currentTarget.play().then(() => {
                console.log('play');
            });
        };
    };    
  };

 const handleSuccess = (stream) => {
    
    if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')){
      extension="ogg";
    }

    const options = { 
      mimeType: `audio/${extension};codecs=opus`,
      audioBitsPerSecond : 8000, //44100,256000
      bitsPerSecond: 8000 //2628000
    };
    mediaRecorder = new window.MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);     
      }
      if (mediaRecorder.state == 'inactive') {
	          // convert stream data chunks to a 'webm' audio format as a blob
	          const blob = new Blob(recordedChunks, { type: `audio/${extension}`, bitsPerSecond:128000});//
	          console.log('blob', blob);
            const dados = recordedChunks;
            playAudio(blob);
            recordedChunks = [];
            mediaRecorder.start(1000);
	    }
    };

    mediaRecorder.onstop = (e) => {
      // downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
      // downloadLink.download = 'acetest.wav';
      //mediaRecorder.start();
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
    mediaRecorder.start(1000);
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
    // const dados = recordedChunks;
    // playAudio(dados);
    // recordedChunks = [];

    setTimeout(() => {
      recognize();    
    }, 2000); 
  }

  return (<div>Recorder Audio</div>);
}

export default SpeechWithRecorderAudio;