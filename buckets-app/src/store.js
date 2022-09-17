import { configureStore } from '@reduxjs/toolkit'
import graphReducer from './slices/graphSlice';


function initalReducer(state= {}, action) {
    switch(action.type){
      default:
        return state;
    }
  }

export default configureStore({
  reducer: {
      graph: graphReducer,
}
})