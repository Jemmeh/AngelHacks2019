import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { signUpRequest, signInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import Modal from '../helpers/modal';
import UserAuthForm from '../userAuth-form';
import { logError, renderIf } from './../../lib/util.js';

class Intro extends React.Component {
  constructor(props){
    super(props);
    this.state = { authFormAction: 'Sign Up', formDisplay: false, step: 0 };
  }

  componentWillUnmount() {
    this.setState({ authFormAction: 'Sign Up', formDisplay: false, step: 0 });
  }

  handleSignin = (user, errCB) => {
    return this.props.signIn(user)
      .then(() => {
        return this.props.userProfileFetch()
          .catch(err => logError(err));
      })
      // .then(() => this.handleStep(1))
      .catch(err => {
        logError(err);
        errCB(err);
      });
  };
  handleSignup = (user, errCB) => {
    return this.props.signUp(user)
      .then(() => {
        return this.props.userProfileFetch()
          .catch(err => logError(err));
      })
      // .then(() => this.handleStep(1))
      .catch(err => {
        logError(err);
        errCB(err);
    });
  };

  // handleStep = num => {
  //   setTimeout(() => this.setState({ step: num }), 3000);
  // };

  render() {
    let handleComplete = this.state.authFormAction === 'Sign Up' ? this.handleSignup : this.handleSignin;
    const drsImage = require("./../helpers/assets/drs.jpg");
    return (
      // <div className="intro">
      //   <section id="introView" className="view introView">
      //     <p>
      //       click the button below to  signup or sign in!
      //     </p>
      //     <button className='button' onClick={() => this.setState({formDisplay: true})}id="start-button" >
      //       START
      //     </button>
      //   </section>
      //   <div>
      //     {renderIf(this.state.formDisplay,
      //       <div>
      //         <Modal heading='Olympic App' close={() => this.setState({ formDisplay: false })}>
      //           <UserAuthForm authFormAction={this.state.authFormAction} onComplete={handleComplete} />
      //           <div className='userauth-buttons'>
      //             {renderIf(this.state.authFormAction==='Sign In',
      //               <button className='formButton darkButton' onClick={() => this.setState({authFormAction: 'Sign Up'})}>Sign Up</button>
      //             )}
      //             {renderIf(this.state.authFormAction==='Sign Up',
      //               <button className='formButton darkButton' onClick={() => this.setState({authFormAction: 'Sign In'})}>Sign In</button>
      //             )}
      //           </div>
      //         </Modal>
      //       </div>
      //     )}
      //   </div>
      // </div>
      <div>
        <div className='entryPage'>
          <img src={drsImage} className='drsImage' />
          <div className='blueSquare'><span>MC</span></div>
          <div className='entryText'>
            <p>My Chart lets you access your <br/> medical records from the <br/>comfort of your own home.</p>
          </div>
          <div className='signUpSignInDiv'>
            <p>
              <span className='signIn' onClick={() => this.setState({authFormAction: 'Sign In', formDisplay: true})}>Sign In</span>
              <span className='signUp' onClick={() => this.setState({authFormAction: 'Sign Up', formDisplay: true})}>Sign Up</span>
            </p>
          </div>
        </div>
        {renderIf(this.state.formDisplay,
            <div>
              <Modal heading='Olympic App' authFormAction={this.state.authFormAction} close={() => this.setState({ formDisplay: false })}>
                {renderIf(this.state.formDisplay && !this.props.userAuth && !this.props.imgAuth && !this.props.licenseAuth,
                  <div>
                    <UserAuthForm authFormAction={this.state.authFormAction} onComplete={handleComplete} />
                  </div>
                )}
                {renderIf(this.state.formDisplay && this.props.userAuth && !this.props.imgAuth && !this.props.licenseAuth,
                  <div>
                    {renderIf(this.state.formDisplay && this.props.userAuth && !this.props.imgAuth && !this.props.licenseAuth && this.state.step === 0,
                      <div className='stepDiv step1'>
                        <p>Before we get going lets authenticate your identity.</p>
                        <p>It's a 3 step process, have your ID ready.</p>
                        <button onClick={() => this.setState({ step: 1 })}>Proceed</button>
                      </div>
                    )}
                    {renderIf(this.state.formDisplay && this.props.userAuth && !this.props.imgAuth && !this.props.licenseAuth && this.state.step === 1,
                      <div className='facialStep authStep'>
                        <p className='authStepHead'>Facial Verification</p>

                        <p className='authStepDetail'>
                          Look straight at the screen.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Modal>
            </div>
          )}
      </div>
    );
  }
}

let mapStateToProps = state => ({
  userAuth: state.userAuth,
  imgAuth: state.imgAuth,
  licenseAuth: state.licenseAuth,
  userProfile: state.userProfile,
});

let mapDispatchToProps = dispatch => {
  return {
    signUp: user => dispatch(signUpRequest(user)),
    signIn: user => dispatch(signInRequest(user)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Intro);