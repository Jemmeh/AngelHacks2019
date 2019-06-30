import { combineReducers } from 'redux';
import userAuth from './userAuth-reducers';
import imgAuth from './imgAuth-reducers';
import licenseAuth from './licenseAuth-reducers';
import userProfile from './userProfile-reducers';

export default combineReducers({
  userAuth,
  imgAuth,
  licenseAuth,
  userProfile,
});