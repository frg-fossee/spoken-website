import {combineReducers} from "redux";

import tutorialsReducer from './tutorials/tutorials.reducer';

const rootReducer = combineReducers({
    tutorials: tutorialsReducer
})

export default rootReducer
