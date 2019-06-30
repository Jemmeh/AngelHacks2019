export default (state=null, action) => {
  let { type, payload } = action;

  switch(type) {
    case 'LICENSE_AUTH':
      return payload;
    case 'SIGN_OUT':
      return null;
    default:
      return state;
  }
};