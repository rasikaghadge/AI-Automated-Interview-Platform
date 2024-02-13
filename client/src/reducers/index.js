import { combineReducers } from 'redux'

import clients from './clients'
import auth from './auth'
import profiles from './profiles'

export default combineReducers({ clients, auth, profiles })