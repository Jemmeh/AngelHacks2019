import React from "react";
import { connect } from 'react-redux';
import AWS from "aws-sdk";

import { imgAuthFetch } from '../../actions/imgAuth-actions.js';
import { licenseAuthFetch } from '../../actions/licenseAuth-actions.js';
import { renderIf, classToggler } from './../../lib/util.js';

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIASDJ7LHTVO46NM7A2",
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
      params: {},
      wide: 0,
      picTaken: false,
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
    this.setState({wide: this.refs.video.getBoundingClientRect().width });
  }

  takePicture = () => {
    this.setState({picTaken: true});
    let canvas = this.refs.canvas;
    this.refs.canvas.getContext("2d").drawImage(this.refs.video, 0, 0, this.state.wide, this.state.wide*.75);
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
    let num = 1;
    let bool = false;
    let bool1 = false;
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
            if (this.props.imgAuth) {
              bool1 = true;
              this.props.licenseAuthFetchReq(bool1);
            }
            imgs.img1 === null
              ? (imgs.img1 = imageBytes)
              : (imgs.img2 = imageBytes);
            console.log(imgs.img1, "and ", imgs.img2);
            this.setState({ images: imgs });
            if (imgs.img2) {
              this.validateFaces();
            } else {
              num = 2;
              bool = true;
              this.props.imgAuthFetchReq(bool);
              return this.props.match(num);
              // alert("Take Picture of Valid ID");
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
    let bool = false;
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
            return this.props.match;
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
        <button type="button" onClick={this.takePicture}>
          Take Picture
        </button>
        {/* {renderIf(this.state.picTaken, */}
          <canvas
            className={classToggler({
              'picture': true,
              'show': this.state.picTaken,
            })}
            width={this.state.wide}
            height={this.state.wide*.75}
            ref="canvas"
          />
        {/* )} */}
      </div>
    );
  }
}

let mapStateToProps = state => ({
  userAuth: state.userAuth,
  imgAuth: state.imgAuth,
  licenseAuth: state.licenseAuth,
  allAuth: state.allAuth,
});

let mapDispatchToProps = dispatch => {
  return {
    imgAuthFetchReq: bool => dispatch(imgAuthFetch(bool)),
    licenseAuthFetchReq: bool => dispatch(licenseAuthFetch(bool)),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Video);