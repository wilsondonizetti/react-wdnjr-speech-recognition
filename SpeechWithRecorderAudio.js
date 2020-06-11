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
      audioBitsPerSecond : 44100, //44100,256000
      bitsPerSecond: 44100 //2628000,
    };
    mediaRecorder = new window.MediaRecorder(stream, options);
    // const context = new AudioContext();
    // const source = context.createMediaStreamSource(stream);
    // const processor = context.createScriptProcessor(1024, 1, 1);

    // source.connect(processor);
    // processor.connect(context.destination);

    const ctx = new AudioContext();
    const mic = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    const processor = ctx.createScriptProcessor(1024, 1, 1);
    const osc = ctx.createOscillator();
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    processor.onaudioprocess = (e) => {
      // Do something with the data, e.g. convert it to WAV
      //console.log(e.inputBuffer);
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      const values = 0;

      const length = array.length;
      for (let i = 0; i < length; i++) {
        values += (array[i]);
      }

      const average = values / length;
      if(average > 15){
        if (mediaRecorder && mediaRecorder.state === 'inactive') {
             mediaRecorder.start();
        }
           
        console.log(Math.round(average));
      } else {
        if (mediaRecorder && mediaRecorder.state == 'recording') {
             mediaRecorder.stop();
        }
      }
    };

    mic.connect(analyser); 
    processor.connect(ctx.destination);
    //osc.connect(ctx.destination);
    //osc.start(0);
    // var data = new Uint8Array(analyser.frequencyBinCount);

    // const play = () => {
    //     analyser.getByteFrequencyData(data);

    //     // get fullest bin
    //     var idx = 0;
    //     for (var j=0; j < analyser.frequencyBinCount; j++) {
    //         if (data[j] > data[idx]) {
    //             idx = j;
    //         }
    //     }

    //     var frequency = idx * ctx.sampleRate / analyser.fftSize;
    //     console.log(frequency);
    //     osc.frequency.value = frequency;

    //     requestAnimationFrame(play);
    // }

    // play();

    //.log('sampleRate', mediaRecorder.em);
    //console.log('audioBitsPerSecond', mediaRecorder.prototype.audioBitsPerSecond);
    //mediaRecorder.prototype.options.audioBitsPerSecond = 8000
    mediaRecorder.addEventListener('dataavailable', e => {
      if (e.data.size > 0) {
          recordedChunks.push(e.data);           
      }
      if (mediaRecorder.state == 'inactive') {
	          // convert stream data chunks to a 'webm' audio format as a blob
            
	          // const blob = new Blob(recordedChunks);

            // playAudio(blob);
            // recordedChunks = [];
            //mediaRecorder.start();
	    }
    });

     mediaRecorder.addEventListener('stop', e => {
      // downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
      // downloadLink.download = 'acetest.wav';

      const blob = new Blob(recordedChunks, {bitsPerSecond: 44100});
      
      // blob.arrayBuffer().then(buffer => {
      //   const uint8View = new Uint8Array(buffer);

      //   const audioBlob = exportWAV(uint8View, 'audio/wav', 44100,44100, 1);
      //   //const dataview = encodeWAV(uint8View,1,44100);
      //   //const audioBlob = new Blob([dataview], { type: 'audio/wav' });       
      //   //playAudio(blob);
      //   playAudio(audioBlob);
          
      // }).catch(err=> console.log('err', err.message)); 
      playAudio(blob);
      recordedChunks = [];
      //mediaRecorder.start(); 
      // const blob = new Blob(recordedChunks, {type: 'audio/wav', bitsPerSecond: 16000});
      
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
    //mediaRecorder.start();
    // setTimeout(() => {
    //   recognize();    
    // }, 2000);    
  };

  const colorPids = (vol) => {
  let all_pids = $('.pid');
  let amout_of_pids = Math.round(vol/10);
  let elem_range = all_pids.slice(0, amout_of_pids)
  for (var i = 0; i < all_pids.length; i++) {
    all_pids[i].style.backgroundColor="#e6e7e8";
  }
  for (var i = 0; i < elem_range.length; i++) {

    // console.log(elem_range[i]);
    elem_range[i].style.backgroundColor="#69ce2b";
  }
}

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
    // if (mediaRecorder && mediaRecorder.state !== 'paused') {
    //         mediaRecorder.stop();
    //         setTimeout(() => {
    //             recognize();
    //         }, 3000);
    //     }
  }

  const exportWAV = (recBuffers, type, desiredSamplingRate,sampleRate, numChannels) =>{
    //debugger;
    //console.log('bf',recBuffers, recBuffers.byteLength)
    let buffers = [];
    for (let channel = 0; channel < numChannels; channel++) {
        buffers.push(mergeBuffers(recBuffers[channel], recBuffers[channel].length));
    }
    let interleaved;
    if (numChannels === 2) {
        interleaved = interleave(buffers[0], buffers[1]);
    } else {
        interleaved = buffers[0];
    }
    let dataview = encodeWAV(interleaved,numChannels, sampleRate);
    let audioBlob = new Blob([dataview], {type: type});
    return audioBlob
}

const mergeBuffers = (recBuffers, recLength) => {
    let result = new Float32Array(recLength);
    let offset = 0;
    for (let i = 0; i < recBuffers.length; i++) {
        result.set(recBuffers[i], offset);
        offset += recBuffers[i].length;
    }
    return result;
};

const encodeWAV = (samples, numChannels, sampleRate) => {
    let buffer = new ArrayBuffer(44 + samples.length * 2);
    let view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numChannels * 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    floatTo16BitPCM(view, 44, samples);

    return view;
};    

const floatTo16BitPCM = (output, offset, input) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}
const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}    

  
  return (<div>Recorder Audio</div>);
}

export default SpeechWithRecorderAudio;