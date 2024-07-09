import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { getUserReducer, loginReducer, logoutReducer, registerReducer, resetPasswordReducer } from "../redux/reducers/authReducers";

const rootReducers = combineReducers({
    user: getUserReducer,
    loginReducer,
    registerReducer,
    resetPasswordReducer,
    logoutReducer,
});

const store = createStore(rootReducers, applyMiddleware(thunk))

export default store;