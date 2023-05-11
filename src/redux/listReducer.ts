const SET_LIST = 'SET_LIST';

export default (state = {}, action) => {
    switch (action.type) {
        case SET_LIST:
            return { ...state, config: action.value }
        default:
            return state;
    }
}

export const setListConfig = value => ({ type: SET_LIST, value });