import {TutorialsActionTypes} from "./tutorials.types";

export const setAllTutorials = tutorials => ({
    type: TutorialsActionTypes.SET_ALL_TUTORIALS,
    payload: tutorials
});
