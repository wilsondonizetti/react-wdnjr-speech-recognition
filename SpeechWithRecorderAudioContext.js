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
  // const [audioContext, setAudioContext] = useState(null);
  // const [analyser, setAnalyser] = useState(null); 
  // const [audioStream, setAudioStream] = useState(null); 
  // const [min_decibels] = useState(-80); 
  // const [silence_delay ] = useState(500); 
  // const [extension, setExtension] = useState('audio/mpeg');   

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

//   const detectSilence = (
//   stream,
//   onSoundEnd = _=>{},
//   onSoundStart = _=>{},
//   silence_delay = 500,
//   min_decibels = -80
//   ) => {

//   const data = new Uint8Array(analyser.frequencyBinCount); // will hold our data
//   let silence_start = performance.now();
//   let triggered = false; // trigger only once per silence event

//   const loop = (time) => {
//     requestAnimationFrame(loop); // we'll loop every 60th of a second to check
//     analyser.getByteFrequencyData(data); // get current data
//     if (data.some(v => v)) { // if there is data above the given db limit
//       if(triggered){
//         triggered = false;
//         onSoundStart();
//         }
//       silence_start = time; // set it to now
//     }
//     if (!triggered && time - silence_start > silence_delay) {
//       onSoundEnd();
//       triggered = true;
//     }
//   }
//   loop();
// }

// const onSilence = ()=> {
//   console.log('silence');
// }
// const onSpeak = (data) => {
//   console.log('speaking', data);
// }

 const handleSuccess = (stream) => {
    const ext = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg'].filter(ex=> MediaRecorder.isTypeSupported(ex))[0];    
    console.log('ext', ext);

    // const context = new AudioContext();
    // const source = context.createMediaStreamSource(stream);
    // const processor = context.createScriptProcessor(1024, 1, 1);

    // source.connect(processor);
    // processor.connect(context.destination);

    // processor.onaudioprocess = function(e) {
    //   // Do something with the data, e.g. convert it to WAV
    //   console.log(e.inputBuffer);
    // };


    const options = {mimeType: 'audio/webm'};
    mediaRecorder = new window.MediaRecorder(stream, options);

    mediaRecorder.addEventListener('dataavailable', e => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
      console.log('dataavailable');
      if(shouldStop === true && stopped === false) {
        mediaRecorder.stop();
        setStopped(true);
      }
    });

    mediaRecorder.addEventListener('stop', () => {
      console.log('stop');
      const audio = new Blob(recordedChunks);      
      playAudio(audio);
      setShouldStop(false);
      mediaRecorder.start();
    });

    setMediaRecorder(mediaRecorder);
    mediaRecorder.start();
    setTimeout(() => {
      recognize();    
    }, 2000);    
  };

  useEffect(()=>{
    const audioConstraints = {
            noiseSuppression: true,
            sampleRate: 48000,
            echoCancellation: true,
            channelCount: 1,
            autoGainControl: true,
            volume: 0
        };

    navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: false })
    .then(handleSuccess)
    .catch((err)=> {
      console.log('ERRO', err);
    }); 
  },[]);

  const recognize = () => {
    setShouldStop(true);
    setTimeout(() => {
      recognize();    
    }, 2000); 
  }

  
  return (<div>Recorder Audio: SpeechWithRecorderAudioContext</div>);
}

export default SpeechWithRecorderAudioContext;