import React from 'react';
import { renderIf } from './../../../lib/util.js';

class Modal extends React.Component {

  render() {
    let afHeader = this.props.authFormAction === 'Sign Up' ? 'Create Account' : 'Sign In';
    const logo = require("./../assets/logo.svg");
    const logo1 = require("./../assets/logo1.svg");
    const whitelogo = require("./../assets/whitelogo.svg");
    return (
      <div className='modal'>
        <div className='modal-overlay' onClick={this.props.close}></div>
        <div className='modal-wrapper'>
          {/* <div className='modal-close' onClick={this.props.close}></div> */}
          <div className='authFormHeader'>
            <p><span onClick={this.props.close}>Back</span></p>
            {(renderIf(this.props.step === 0,
              <p>{afHeader}</p>
            ))}
            {(renderIf(this.props.step === 1,
              <p>Facial Verification</p>
            ))}
          </div>
          {/* <div className='afLogodiv'>
            <p><span>My</span></p>
            <p>Chart</p>
          </div> */}
          <div className='afLogodiv'>
            <div>
              <img src={logo1}/>
            </div>
          </div>
          <div className='modal-body'>
            <div className='modal-content'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;