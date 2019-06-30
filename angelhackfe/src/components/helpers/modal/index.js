import React from 'react';

class Modal extends React.Component {
  render() {
    let afHeader = this.props.authFormAction === 'Sign Up' ? 'Create Account' : 'Sign In';
    return (
      <div className='modal'>
        <div className='modal-overlay' onClick={this.props.close}></div>
        <div className='modal-wrapper'>
          {/* <div className='modal-close' onClick={this.props.close}></div> */}
          <div className='authFormHeader'>
            <p><span onClick={this.props.close}>Back</span></p>
            <p>{afHeader}</p>
          </div>
          <div className='afLogodiv'>
            <p><span>My</span></p>
            <p>Chart</p>
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