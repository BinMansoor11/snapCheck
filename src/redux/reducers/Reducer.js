import {
  GET_CODE,
  GET_LOCATION,
  UPDATE_LOCATION,
  GET_IMAGE,
  PROFILE_PIC,
  ADD_USER,
  LOADING,
  LOADED,
} from '../actions/types';

const initialState = {
  number: '',
  code: '',
  verifiedCode: '',
  location: [],
  _loading: false,
  _loaded: false,
  _res: null,
  image: '',
  profilePic: '',
  newUserPic: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CODE:
      return {
        ...state,
        number: action.number,
        code: action.code,
        verifiedCode: action.verifiedCode,
      };
      break;

    case GET_LOCATION:
      return {
        ...state,
        location: action.payload,
        _loading: false,
      };
      break;

    case LOADING:
      return {
        ...state,
        _loading: action.payload,
      };
      break;
    case LOADED:
      return {
        ...state,
        _loaded: action.payload,
        _res: action.res,
      };
      break;

    case UPDATE_LOCATION:
      return {
        ...state,
        location: action.payload,
      };
      break;

    case GET_IMAGE:
      return {
        ...state,
        image: action.image,
      };
      break;
    case PROFILE_PIC:
      return {
        ...state,
        profilePic: action.image,
      };
      break;
    case ADD_USER:
      return {
        ...state,
        newUserPic: action.image,
      };
      break;
    default:
      return state;
  }
}

// case SELECTED_MEAL_ARR:
//   return {
//     ...state,
//     selectedMealArr: action.payload,
//   };
