import React, {useEffect, useState} from 'react';
import AudioRecorder from 'audio-recorder-polyfill';
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder';
//AudioRecorder.encoder = mpegEncoder;
//AudioRecorder.prototype.mimeType = 'audio/mpeg';
//window.MediaRecorder = AudioRecorder;
const SpeechWithRecorderAudio = (props) => {
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
      audioBitsPerSecond : 16000, //44100,256000
      bitsPerSecond: 16000 //2628000,
    };
    mediaRecorder = new window.MediaRecorder(stream, options);
        
    //.log('sampleRate', mediaRecorder.em);
    //console.log('audioBitsPerSecond', mediaRecorder.prototype.audioBitsPerSecond);
    //mediaRecorder.prototype.options.audioBitsPerSecond = 8000
    mediaRecorder.addEventListener('dataavailable', e => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);     
      }
      if (mediaRecorder.state == 'inactive') {
	          // convert stream data chunks to a 'webm' audio format as a blob
            
	          const blob = new Blob(recordedChunks);

            playAudio(blob);
            recordedChunks = [];
            mediaRecorder.start();
	    }
    });

     mediaRecorder.addEventListener('stop', e => {
      // downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
      // downloadLink.download = 'acetest.wav';
      //mediaRecorder.start();
      console.log('stop', e);      
    });

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

    setMediaRecorder(mediaRecorder);
    mediaRecorder.start();
    setTimeout(() => {
      recognize();    
    }, 2000);    
  };

  useEffect(()=>{
    const audioConstraints = {
            noiseSuppression: true,
            sampleRate: 16000,
            echoCancellation: true,
            channelCount: 1,
            autoGainControl: true,
            volume: 1.0
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

  const exportWAV = (type, desiredSamplingRate, numChannels) =>{
    var buffers = [];
    for (var channel = 0; channel < numChannels; channel++){
        var buffer = mergeBuffers(recBuffers[channel], recLength);
        buffer = interpolateArray(buffer, desiredSamplingRate, sampleRate);
        buffers.push(buffer);
    }
    sampleRate = desiredSamplingRate;
    if (numChannels === 2){
        var interleaved = interleave(buffers[0], buffers[1]);
    } else {
        var interleaved = buffers[0];
    }
    var dataview = encodeWAV(interleaved);
    var audioBlob = new Blob([dataview], { type: type });
    return audioBlob;
}

  const interpolateArray = (data, newSampleRate, oldSampleRate) => {
    var fitCount = Math.round(data.length*(newSampleRate/oldSampleRate));
    var newData = new Array();
    var springFactor = new Number((data.length - 1) / (fitCount - 1));
    newData[0] = data[0]; // for new allocation
    for ( var i = 1; i < fitCount - 1; i++) {
    var tmp = i * springFactor;
    var before = new Number(Math.floor(tmp)).toFixed();
    var after = new Number(Math.ceil(tmp)).toFixed();
    var atPoint = tmp - before;
    newData[i] = linearInterpolate(data[before], data[after], atPoint);
    }
    newData[fitCount - 1] = data[data.length - 1]; // for new allocation
    return newData;
};
const linearInterpolate = (before, after, atPoint) => {
    return before + (after - before) * atPoint;
};

  
  return (<div>Recorder Audio</div>);
}

export default SpeechWithRecorderAudio;