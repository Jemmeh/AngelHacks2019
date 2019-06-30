import React from "react";
import Webcam from "react-webcam";
 
class Video extends React.Component {
  constructor(props){
    super(props);
    this.state = {videoSrc: null}
  }

  componentDidMount(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true, audio: true}, this.handleVideo, this.videoError);
    }
  }

  takePicture = () => {
    let canvas = this.refs.canvas;
    canvas.getContext("2d").drawImage(this.refs.video, 0, 0, 300, 300, 0, 0, 300, 300);
    canvas.toDataURL("image/png");
  };
  
  handleVideo = stream => {
    this.refs.video.srcObject = stream;
  };

  videoError = () => {

  };

  render() {
    return (
      <div>
        <video autoPlay={true} ref="video"/>
        <button type="button" onClick={this.takePicture}>Take Picture</button>
	      <canvas width="300" height="300" ref="canvas"></canvas>
      </div>
    );
  }
}

export default Video;
