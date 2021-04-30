import React from 'react';
import '../listen.css';
const axios = require('axios');
const baseUrl = ' https://immense-shelf-84954.herokuapp.com';

export default class ListenPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      blobUrL: '',
      isBlocked: false,
      audio: null,
      file: null,
    };
  }

  componentDidMount() {
    (async (_) => {
      try {
        const result = await axios.get(
          `${baseUrl}/audio/${this.props.match.params.id}`
        );
        console.log(result, 'resultfrom get api');

        this.setState({ audio: result.data });
        // const file = new File(
        //   result.data.buffer.data,
        //   "me-at-thevoice.mp3",
        //   {
        //     type: "audio/mp3",
        //   }
        // );
        // console.log(file, 'fileee')
        // this.setState({ file });
        // const blobUrL = URL.createObjectURL(file);
        // this.setState({ blobUrL });
      } catch (err) {
        console.log(err);
      }
    })();
  }

  render() {
    if (this.state.audio) {
      return (
        <div className="listen">
          {/* <audio src={this.state.blobUrL} controls="controls" /> */}
          <header>
            <a href="/">Talk N Send</a>
            <div className="container">
              <div className="intro">
                <p>Talk N Send - Free audio recording and sharing service..</p>
              </div>
            </div>
          </header>

          <audio
            controls="controls"
            autobuffer="autobuffer"
            style={{ width: '400px' }}
          >
            <source src={this.state.audio?.base64String} />
          </audio>
        </div>
      );
    }
    return <p>Loading</p>;
  }
}
