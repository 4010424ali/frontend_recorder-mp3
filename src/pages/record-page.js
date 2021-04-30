import React from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import { Link } from 'react-router-dom';
import mic from '../img/mic.svg';
import stop from '../img/stop.svg';
import redo from '../img/redo.svg';
import '../app.css';
import Footer from '../components/footer';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });
const axios = require('axios').default;
const baseUrl = 'https://boiling-ocean-63131.herokuapp.com';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
      buffer: null,
      showBtn: false,
      audioId: '',
      loader: false,
      fine: false,
      showLink: false,
    };

    navigator.mediaDevices.getUserMedia(
      { audio: true },
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true });
      }
    );
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder.start()
        .then(() => {
          this.setState({ isRecording: true });
        })
        .catch((e) => console.error(e));
    }
  };

  stop = () => {
    this.setState({ loader: true, fine: true });
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          let base64data = reader.result;

          const file = new File(buffer, 'me-at-thevoice.mp3', {
            type: blob.type,
          });
          const blobURL = URL.createObjectURL(file);

          this.setState({ buffer: buffer });
          this.setState({ blobURL, isRecording: false });
          this.saveAudio(base64data);
        };
      })
      .catch((e) => console.log(e));
  };

  saveAudio = async (base64data) => {
    const data = {
      buffer: this.state.buffer,
      base64data: base64data,
    };
    try {
      const res = await axios.post(`${baseUrl}/audio`, data);
      console.log(res);
      this.setState({ showBtn: true, audioId: res.data._id, loader: false });
    } catch (err) {
      console.log('err from audio post api', err);
    }
  };

  render() {
    return (
      <div className="app">
        <header>
          <h1>Talk N Send</h1>
          <div className="container">
            <div className="intro">
              <p>Talk N Send - Free audio recording and sharing service.</p>
            </div>
          </div>
        </header>

        {!this.state.fine && (
          <>
            <div
              className="recordCont"
              style={this.state.isRecording ? { display: 'none' } : null}
            >
              <button
                onClick={this.start}
                disabled={this.state.isRecording}
                id="record"
                className="record"
                style={{ display: 'none' }}
              ></button>
              <label htmlFor="record">
                <img src={mic} alt="mic icon" width="80px" />
              </label>
            </div>

            <div
              className="stopCont"
              style={!this.state.isRecording ? { display: 'none' } : null}
            >
              <button
                onClick={this.stop}
                disabled={!this.state.isRecording}
                className="stop"
              >
                <img src={stop} alt="stop icon"></img>
              </button>
            </div>
          </>
        )}

        {this.state.showBtn && (
          <div className="audio-cont">
            <a href="/">
              <img
                src={redo}
                alt="refresh icon"
                style={{ marginTop: '3px', marginLeft: '8px', height: '70px' }}
              />
            </a>{' '}
            {/* cambiare in / */}
            <audio src={this.state.blobURL} controls="controls" />
          </div>
        )}

        {this.state.loader && (
          <h2
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '100px',
              textAlign: 'center',
            }}
          >
            Loading... <br />
            (It would take a while)<div className="loader"></div>
          </h2>
        )}

        {this.state.showBtn && (
          <button
            className="share"
            onClick={() => {
              this.setState({ showLink: true });
            }}
            style={this.state.showLink ? { display: 'none' } : null}
          >
            Save &#38; Share &#62;&#62;
          </button>
        )}

        {this.state.showLink && (
          <>
            <div className="link">
              <p>Share this link:</p>
              <Link
                style={{
                  background: '#ffffcc',
                  padding: '10px',
                  borderRadius: '6px',
                  color: 'black',
                }}
                to={`/audio/${this.state.audioId}`}
              >
                http://localhost/3000/audio/{this.state.audioId}
              </Link>
              <div className="download-share">
                <button
                  style={{ cursor: 'pointer' }}
                  onClick={async () => {
                    let text =
                      'http://localhost/3000/audio/' + this.state.audioId;
                    navigator.clipboard.writeText(text);
                  }}
                >
                  Copy Link
                </button>
                <a className="download" href={this.state.blobURL} download>
                  download
                </a>
              </div>
            </div>
            <div className="mobile">
              <p>Share this link:</p>
              <div className="links">
                <Link
                  style={{
                    background: '#ffffcc',
                    padding: '10px',
                    borderRadius: '6px',
                    color: 'black',
                  }}
                  to={`/audio/${this.state.audioId}`}
                >
                  http://localhost/3000/au..
                </Link>
                <button
                  style={{ cursor: 'pointer' }}
                  onClick={async () => {
                    let text =
                      'http://localhost/3000/audio/' + this.state.audioId;
                    navigator.clipboard.writeText(text);
                  }}
                >
                  Copy Link
                </button>
              </div>
              <a className="download" href={this.state.blobURL} download>
                download
              </a>
            </div>
          </>
        )}

        <Footer />
      </div>
    );
  }
}
