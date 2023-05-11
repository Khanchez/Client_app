const SET_LIST_ITEM = 'SET_LIST_ITEM';

let initialState = {
  
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_LIST_ITEM:
            return { ...state, currentItem: action.value }
        default:
            return state;
    }
}

export const setCurrentListItem = value => ({ type: SET_LIST_ITEM, value });