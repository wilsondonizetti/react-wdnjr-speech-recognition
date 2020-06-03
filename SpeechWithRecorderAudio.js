import React, {useEffect, useState} from 'react';
import AudioRecorder from 'audio-recorder-polyfill';
AudioContext = (window.AudioContext || window.webkitAudioContext);
const SpeechWithRecorderAudio = (props) => {
  const [shouldStop, setShouldStop] = useState(false);
  const [stopped, setStopped] = useState(false);  
  const [mediaRecorder, setMediaRecorder] = useState(null); 
  const [recordedChunks, setRecordedChunks] = useState([]);
  let extension = 'webm';
  const audioContext = new AudioContext();

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
    mediaRecorder = new AudioRecorder(stream, options);
    mediaRecorder.addEventListener('dataavailable', e => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);     
      }
      if (mediaRecorder.state == 'inactive') {
	          // convert stream data chunks to a 'webm' audio format as a blob
            
	          const blob = new Blob(recordedChunks, { type: `audio/wav`, bitsPerSecond:8000});

            playAudio(blob);
            recordedChunks = [];
            mediaRecorder.start(1000);
	    }
    });

    // mediaRecorder.onstop = (e) => {
    //   // downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
    //   // downloadLink.download = 'acetest.wav';
    //   //mediaRecorder.start();
    //   console.log('stop', e);      
    // };

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
    mediaRecorder.start(1000);
    setTimeout(() => {
      recognize();    
    }, 2000);    
  };

  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({audio: {
      sampleRate: 8000,
      channelCount: 1
    }, video: false})
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

  const audioBufferToWav = (buffer, opt) => {
  opt = opt || {}

  var numChannels = buffer.numberOfChannels
  var sampleRate = buffer.sampleRate
  var format = opt.float32 ? 3 : 1
  var bitDepth = format === 3 ? 32 : 16

  var result
  if (numChannels === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1))
  } else {
    result = buffer.getChannelData(0)
  }

  return encodeWAV(result, format, sampleRate, numChannels, bitDepth)
}

  const encodeWAV = (samples, format, sampleRate, numChannels, bitDepth) => {
  var bytesPerSample = bitDepth / 8
  var blockAlign = numChannels * bytesPerSample

  var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
  var view = new DataView(buffer)

  /* RIFF identifier */
  writeString(view, 0, 'RIFF')
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * bytesPerSample, true)
  /* RIFF type */
  writeString(view, 8, 'WAVE')
  /* format chunk identifier */
  writeString(view, 12, 'fmt ')
  /* format chunk length */
  view.setUint32(16, 16, true)
  /* sample format (raw) */
  view.setUint16(20, format, true)
  /* channel count */
  view.setUint16(22, numChannels, true)
  /* sample rate */
  view.setUint32(24, sampleRate, true)
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true)
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true)
  /* bits per sample */
  view.setUint16(34, bitDepth, true)
  /* data chunk identifier */
  writeString(view, 36, 'data')
  /* data chunk length */
  view.setUint32(40, samples.length * bytesPerSample, true)
  if (format === 1) { // Raw PCM
    floatTo16BitPCM(view, 44, samples)
  } else {
    writeFloat32(view, 44, samples)
  }

  return buffer
}

const interleave = (inputL, inputR) => {
  var length = inputL.length + inputR.length
  var result = new Float32Array(length)

  var index = 0
  var inputIndex = 0

  while (index < length) {
    result[index++] = inputL[inputIndex]
    result[index++] = inputR[inputIndex]
    inputIndex++
  }
  return result
}

const writeFloat32 = (output, offset, input)=> {
  for (var i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true)
  }
}

const floatTo16BitPCM = (output, offset, input)=> {
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]))
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
  }
}

const writeString = (view, offset, string) => {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

  return (<div>Recorder Audio</div>);
}

export default SpeechWithRecorderAudio;