import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import Speech from './Speech';
import SpeechArtyom from './SpeechArtyom';
import SpeechWithRecorderAudio from './SpeechWithRecorderAudio';
import SpeechWithRecorderAudioContext from './SpeechWithRecorderAudioContext';
import './style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React app with speech recognition'
    };
  }

  render() { 
    return (
      <div>
        <Hello name={this.state.name} />
        <p>
          Start editing to see some magic happen :)
        </p>
        {/*<SpeechWithRecorderAudio />*/}
        <SpeechWithRecorderAudioContext />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
