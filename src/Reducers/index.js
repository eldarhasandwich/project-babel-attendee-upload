import { combineReducers } from 'redux'

import singleAttendee from './singleAttendee';
import { audioReducer as audio } from 'redux-audio-fixed'

const rootReducer = combineReducers({
  singleAttendee
})

export default rootReducer