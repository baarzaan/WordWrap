import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { getUserReducer, loginReducer, logoutReducer, registerReducer, resetPasswordReducer } from "../redux/reducers/authReducers";
import { getUsersReducer } from "@/redux/reducers/usersReducers";
import { acceptFriendRequestReducer, addFriendRequestReducer, getFrinedRequestsReducer, getFrinedsReducer } from "@/redux/reducers/friendsReducers";

const rootReducers = combineReducers({
    user: getUserReducer,
    loginReducer,
    registerReducer,
    resetPasswordReducer,
    logoutReducer,
    users: getUsersReducer,
    addFriendRequestReducer,
    friends: getFrinedsReducer,
    friendRequests: getFrinedRequestsReducer,
    acceptRequest: acceptFriendRequestReducer,
});

const store = createStore(rootReducers, applyMiddleware(thunk))

export default store;