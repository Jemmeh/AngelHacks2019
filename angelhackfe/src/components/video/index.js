import React from "react";
import Webcam from "react-webcam";
import AWS from "aws-sdk";
import "./styles.css";

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIASDJ7LHTVBRN5KDHM",
  secretAccessKey: "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"
});

const rekog = new AWS.Rekognition();

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoSrc: null,
      images: {
        img1: null,
        img2: null
      },
      imgConfidence: 0,
      params: {}
    };
  }

  componentDidMount() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.oGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { video: true, audio: true },
        this.handleVideo,
        this.videoError
      );
    }
  }

  takePicture = () => {
    let canvas = this.refs.canvas;
    canvas
      .getContext("2d")
      .drawImage(this.refs.video, 0, 0, window.innerWidth, window.innerHeight);
    this.validateImg(canvas.toDataURL("image/jpeg"));
  };

  validateImg = image => {
    let imgs = this.state.images;
    var base64Image = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    var imageBytes = this.getBinary(base64Image);
    let params = {
      Image: {
        Bytes: imageBytes
      },
      Attributes: ["ALL"]
    };
    var valid = 0;
    rekog.detectFaces(params, (err, data) => {
      if (err) console.log(err);
      else {
        console.log(data);
        if (data.FaceDetails[0] != undefined) {
          console.log(
            `this is the confidence: ${data.FaceDetails[0].Confidence} `
          );
          let confidence = data.FaceDetails[0].Confidence;
          let num = 80;
          valid = confidence > num ? 1 : 0;
          console.log("val :", valid);
          if (valid) {
            imgs.img1 === null
              ? (imgs.img1 = imageBytes)
              : (imgs.img2 = imageBytes);
            console.log(imgs.img1, "and ", imgs.img2);
            this.setState({ images: imgs });
            if (imgs.img2) {
              this.validateFaces();
            } else {
              alert("Take Picture of Valid ID");
            }
          } else {
            console.log("not valid");
            alert("Unable to detect face!");
          }
        } else {
          console.log("Unable to detect face!");
          alert("Unable to detect face!");
          this.setState({
            images: {
              img1: null,
              img2: null
            }
          });
        }
      }
    });
  };

  getBinary = base64Image => {
    var binaryImg = atob(base64Image);
    var length = binaryImg.length;
    var ab = new ArrayBuffer(length);
    var ua = new Uint8Array(ab);
    for (var i = 0; i < length; i++) {
      ua[i] = binaryImg.charCodeAt(i);
    }

    return ab;
  };

  validateFaces = () => {
    let images = this.state.images;
    let params = {
      SimilarityThreshold: 85,
      SourceImage: {
        Bytes: images.img1
      },
      TargetImage: {
        Bytes: images.img2
      }
    };
    rekog.compareFaces(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.FaceMatches[0] != undefined) {
          console.log(data);
          let similarity = data.FaceMatches[0].Similarity;
          let num = 90;
          if (similarity >= num) {
            console.log("Match");
            this.setState({
              images: {
                img1: null,
                img2: null
              }
            });
          } else {
            console.log("Not A Match!");
          }
        } else {
          console.log("Not A Match!");
          alert("Not A Match!");
          this.setState({
            images: {
              img1: null,
              img2: null
            }
          });
        }
      }
    });
  };

  handleVideo = stream => {
    this.refs.video.srcObject = stream;
  };

  videoError = () => {};

  render() {
    return (
      <div className="cameraView">
        <video className="fullWidth" autoPlay={true} ref="video" />
        <button className="button" type="button" onClick={this.takePicture}>
          Take Picture
        </button>
        <canvas
          className="picture"
          width={window.innerWidth}
          height={window.innerHeight}
          ref="canvas"
        />
      </div>
    );
  }
}

export default Video;
