import {LOGIN_MEMBER, LOG_OUT} from '../action/actionTypes'

export default function(state = {}, action){
  switch (action.type){
    case LOGIN_MEMBER:
      return{
        ...state,
        memberInfo: action.memberInfo
      }
      break;
    case LOG_OUT:
      return {...state,
        login: 'false'
      }
      break;
    default:
      return state
      break;
  }
}