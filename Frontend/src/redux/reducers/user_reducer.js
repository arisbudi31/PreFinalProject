import { LOGIN, EDIT, UPDATE_IMAGE, LOGOUT, ON_START, ON_END } from '../actions/types'

const INITIAL_STATE = {
  username: '',
  email: '',
  fullname: '',
  bio: '',
  image: '',
  status: '',
  loading: false
}

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        username: action.payload.username,
        email: action.payload.email,
        fullname: action.payload.fullname,
        bio: action.payload.bio,
        image: action.payload.image,
        status: action.payload.status
      }
    case EDIT:
      return {
        ...state,
        username: action.payload.username,
        email: action.payload.email,
        fullname: action.payload.fullname,
        bio: action.payload.bio,
        image: action.payload.image,
        status: action.payload.status
      }
    case UPDATE_IMAGE:
      return {
        ...state,
        image: action.payload.image
      }
    case LOGOUT:
      return INITIAL_STATE
    case ON_START:
      return { ...state, loading: true }
    case ON_END:
      return { ...state, loading: false }
    default:
      return state
  }
}

export default userReducer