import { USER, REGISTER_USER } from '../actions/types';

const initialState = {
  user: '',
  userData: [],
  token: '',
  registerationPic: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER:
      return {
        ...state,
        user: action.payload,
        userData: action.data,
        token: action.token,
      };
      break;
    case REGISTER_USER:
      return {
        ...state,
        registerationPic: action.image,
      };
      break;

    default:
      return state;
  }
}
