import { createStore, combineReducers } from 'redux'
import listItem from './listItemReducer'
import list from './listReducer'

let store = createStore(combineReducers({ listItem, list }));
export default store;