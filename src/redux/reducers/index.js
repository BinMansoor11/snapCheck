import { combineReducers } from 'redux';
import Reducer from './Reducer';
import AuthReducer from './authReducer';

export default combineReducers({
  root: Reducer,
  auth: AuthReducer,
});
