import React, {useEffect, useState} from 'react';
//import AudioRecorder from 'audio-recorder-polyfill';
//import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder';
//AudioRecorder.encoder = mpegEncoder;
//AudioRecorder.prototype.mimeType = 'audio/mpeg';
//window.MediaRecorder = AudioRecorder;
const SpeechWithRecorderAudioContext = (props) => {
  const [shouldStop, setShouldStop] = useState(false);
  const [stopped, setStopped] = useState(false);  
  const [mediaRecorder, setMediaRecorder] = useState(null); 
  const [recordedChunks, setRecordedChunks] = useState([]);
  let extension = 'audio/webm';

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
    
    const ext = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg'].filter(ex=> MediaRecorder.isTypeSupported(ex))[0];    
    console.log('ext', ext);

    const options = { 
      mimeType: extension,
      //audioBitsPerSecond : 16000, //44100,256000
      //bitsPerSecond: 16000 //2628000,
    };

    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function(e) {
      // Do something with the data, e.g. convert it to WAV
      console.log(e.inputBuffer);
      var buffer = [];
      for (var channel = 0; channel < this.config.numChannels; channel++) {
          buffer.push(e.inputBuffer.getChannelData(channel));
      }
    };

    //mediaRecorder = new window.MediaRecorder(stream, options);
        
    //.log('sampleRate', mediaRecorder.em);
    //console.log('audioBitsPerSecond', mediaRecorder.prototype.audioBitsPerSecond);
    //mediaRecorder.prototype.options.audioBitsPerSecond = 8000
    // mediaRecorder.addEventListener('dataavailable', e => {
    //   if (e.data.size > 0) {
    //     recordedChunks.push(e.data);     
    //   }
    //   if (mediaRecorder.state == 'inactive') {
	  //         // convert stream data chunks to a 'webm' audio format as a blob
            
	  //         // const blob = new Blob(recordedChunks);

    //         // playAudio(blob);
    //         // recordedChunks = [];
    //         mediaRecorder.start();
	  //   }
    // });

    //  mediaRecorder.addEventListener('stop', e => {
    //   // downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
    //   // downloadLink.download = 'acetest.wav';
    //   const blob = new Blob(recordedChunks);
    //         playAudio(blob);
    //         recordedChunks = [];
    //   //mediaRecorder.start();
    //   console.log('stop', e);      
    // });

    // mediaRecorder.onresume = (e) => {
    //   console.log('onresume', e);
    // };

    // mediaRecorder.onstart = (e) => {
    //   console.log('onstart', e);
    // };

    // mediaRecorder.onpause = (e) => {
    //   console.log('onpause', e);
    // };

    // mediaRecorder.onerror = (e) => {
    //   console.log('onerror', e);
    // };

    // setMediaRecorder(mediaRecorder);
    // mediaRecorder.start();
    // setTimeout(() => {
    //   recognize();    
    // }, 2000);    
  };

  useEffect(()=>{
    const audioConstraints = {
            noiseSuppression: true,
            sampleRate: 16000,
            echoCancellation: true,
            channelCount: 1,
            autoGainControl: true,
            volume: 0.5
        };

    navigator.mediaDevices.getUserMedia({audio: audioConstraints, video: false})
    .then(handleSuccess)
    .catch((err)=> {
      console.log('ERRO', err);
    }); 
  },[]);

  const recognize = () => {
    mediaRecorder.stop();
    setTimeout(() => {
      recognize();    
    }, 2000); 
  }  

  
  return (<div>Recorder Audio: SpeechWithRecorderAudioContext</div>);
}

export default SpeechWithRecorderAudioContext;