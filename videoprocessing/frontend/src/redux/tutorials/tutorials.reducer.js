import {TutorialsActionTypes} from "./tutorials.types";

const INITIAL_STATE = {
    tutorials: []}
;

const tutorialsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TutorialsActionTypes.SET_ALL_TUTORIALS:
            return {
                ...state,
                tutorials: action.payload
            };
        default:
            return state;

    }
};

export default tutorialsReducer;
