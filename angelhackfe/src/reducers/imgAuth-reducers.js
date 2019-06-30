export default (state=null, action) => {
  let { type, payload } = action;

  switch(type) {
    case 'IMG_AUTH':
      return payload;
    case 'SIGN_OUT':
      return null;
    default:
      return state;
  }
};