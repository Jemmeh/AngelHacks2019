import React from 'react';
import { connect } from 'react-redux';

import { signUpRequest, signInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { allAuthFetch } from '../../actions/allAuth-actions.js';
import { imgAuthFetch } from '../../actions/imgAuth-actions.js';
import { licenseAuthFetch } from '../../actions/licenseAuth-actions.js';
import Modal from '../helpers/modal';
import UserAuthForm from '../userAuth-form';
import Video from '../video';
import { logError, renderIf } from './../../lib/util.js';

class Intro extends React.Component {
  constructor(props){
    super(props);
    this.state = { authFormAction: 'Sign Up', formDisplay: false, step: 0, hide: false };
  }

  componentWillUnmount() {
    this.setState({ authFormAction: 'Sign Up', formDisplay: false, step: 0, hide: false });
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

  last = () => {
    let bool = true;
    // this.setState({ step:  });
    this.props.allAuthFetchReq(bool);
  };

  handleStep = num => {
    this.setState({ step: num });
  };

  render() {
    let handleComplete = this.state.authFormAction === 'Sign Up' ? this.handleSignup : this.handleSignin;
    const drsImage = require("./../helpers/assets/drs.jpg");
    const letters = require("./../helpers/assets/letters.png");
    const cm = require("./../helpers/assets/check.svg");
    const uncheck = require("./../helpers/assets/uncheck.png");
    let bool = this.state.step === 4 ? true : false;
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
          {/* <div className='blueSquare'><span>MC</span></div> */}
          <div className='blueSquare'><img src={letters}/></div>
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
              <Modal heading='Olympic App' authFormAction={this.state.authFormAction} close={() => this.setState({ formDisplay: false })} step={this.state.step}>
                {renderIf(this.state.formDisplay && !this.props.userAuth && !this.props.imgAuth && !this.props.licenseAuth,
                  <div>
                    <UserAuthForm authFormAction={this.state.authFormAction} onComplete={handleComplete} />
                  </div>
                )}
                {renderIf(this.state.formDisplay && this.props.userAuth,
                  <div>
                    {renderIf(this.state.formDisplay && this.props.userAuth && !this.props.imgAuth && !this.props.licenseAuth && this.state.step === 0,
                      <div className='stepDiv step1'>
                        <p>Before we get going lets authenticate your identity.</p>
                        <p>It's a 2 step process, have your ID ready.</p>
                        <button onClick={() => this.setState({ step: 1 })}>Proceed</button>
                      </div>
                    )}
                    {renderIf(this.state.formDisplay && this.props.userAuth && !this.props.imgAuth && !this.props.licenseAuth && this.state.step === 1,
                      <div className='facialStep authStep'>
                        <Video match={this.handleStep}/>
                        {/* after verified face,   call this.handleStep(2) */}
                        <p className='authStepDetail'>
                          Look straight at the screen.
                        </p>
                      </div>
                    )}
                    {/* {renderIf(this.state.formDisplay && this.props.userAuth && this.props.imgAuth && !this.props.licenseAuth && this.state.step === 1,
                      <div className='loadingDiv'>
                        <p><span className='scale-up-center'></span>checking</p>
                      </div>
                    )} */}
                    {renderIf(this.state.formDisplay && this.props.userAuth && this.props.imgAuth && !this.props.licenseAuth && this.state.step == 2,
                      <div className='stepDiv step2'>
                        <p>
                          <label> <img src={cm}/> Face</label>
                          <label> <img src={uncheck} className='uncheck'/> ID</label>
                          <button onClick={() => this.setState({ step: 3 })}>Next</button>
                        </p>
                      </div>
                    )}
                    {renderIf(this.state.formDisplay && this.props.userAuth && this.props.imgAuth && !this.props.licenseAuth && this.state.step === 3,
                      <div className='idStep authStep'>
                        {/* after verified face,   set this.state.step 4 */}
                        <Video match={() => this.setState({ step: 4 })}/>
                        <p className='authStepDetail'>
                          On a flat surface photograph the front of your ID.
                        </p>
                      </div>
                    )}
                    {renderIf(this.state.formDisplay && this.props.userAuth && this.props.imgAuth && this.props.licenseAuth,
                      <div className='stepDiv step2'>
                        <label> <img src={cm}/> Face</label>
                        <label> <img src={cm}/> ID</label>
                      <button onClick={this.last}>Next</button>
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
  allAuth: state.allAuth,
  userProfile: state.userProfile,
});

let mapDispatchToProps = dispatch => {
  return {
    signUp: user => dispatch(signUpRequest(user)),
    signIn: user => dispatch(signInRequest(user)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    allAuthFetchReq: bool => dispatch(allAuthFetch(bool)),
    imgAuthFetchReq: bool => dispatch(imgAuthFetch(bool)),
    licenseAuthFetchReq: bool => dispatch(licenseAuthFetch(bool)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Intro);