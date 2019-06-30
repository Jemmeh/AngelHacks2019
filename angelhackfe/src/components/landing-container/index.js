import React from 'react';
import { connect } from 'react-redux';

import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest, userProfileUpdateRequest } from '../../actions/userProfile-actions.js';
import { imgAuthFetch } from '../../actions/imgAuth-actions.js';
import { licenseAuthFetch } from '../../actions/licenseAuth-actions.js';
import Intro from '../intro';
import UserProfileForm from '../userProfile-form';
import Modal from '../helpers/modal';
import Video from '../video';
import { userValidation, logError, renderIf } from './../../lib/util.js';

class LandingContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = { profileFormDisplay: true }
  }
  componentWillMount() {
    userValidation(this.props);
  }
  handleProfileUpdate = profile => {
    return this.props.userProfileUpdate(profile)
      .catch(logError);
  };
  
  render() {
    let profileAction ='create';
    return (
      <section className='landingContainer container-outer'>
        {renderIf(!this.props.allAuth,
            <Intro />
        )}
        {renderIf(this.props.allAuth,
          <div>
            <p> Logged in! </p>
            {renderIf(this.state.profileFormDisplay && this.props.userProfile && this.props.userProfile.lastLogin === this.props.userProfile.createdOn,
              <Modal heading='Create Profile' close={() => { this.setState({ profileFormDisplay: false }); this.handleProfileUpdate(this.props.userProfile); }}>
                <UserProfileForm userProfile={this.props.userProfile} onComplete={this.handleProfileUpdate} profileAction={profileAction} />
              </Modal>
            )}
          </div>
        )}
        {/* <Video /> */}
      </section>
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

let mapDispatchToProps = dispatch => ({
  tokenSignIn: token => dispatch(tokenSignInRequest(token)),
  userProfileFetch: () => dispatch(userProfileFetchRequest()),
  userProfileUpdate: profile => dispatch(userProfileUpdateRequest(profile)),
  imgAuthFetchReq: bool => dispatch(imgAuthFetch(bool)),
  licenseAuthFetchReq: bool => dispatch(licenseAuthFetch(bool)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);