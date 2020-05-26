import {createSelector} from 'reselect';

const selectTutorials = state => state.tutorials

export const selectFosses = createSelector(
    [selectTutorials],
    tutorials => {
        console.log('test',tutorials)
        return 'test'
    })




