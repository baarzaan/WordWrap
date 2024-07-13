import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { getUserReducer, loginReducer, logoutReducer, registerReducer, resetPasswordReducer } from "../redux/reducers/authReducers";
import { getUsersReducer } from "@/redux/reducers/usersReducers";
import { acceptFriendRequestReducer, toggleSendFriendRequestReducer, getFrinedRequestsReducer, getFrinedsReducer, removeFriendReducers } from "@/redux/reducers/friendsReducers";
import { createChatReducer, deleteMessageReducer, getChatIdReducer, getChatsReducer, getMessagesReducer, sendChatReducer, sendMessageReducer } from "@/redux/reducers/chatReducer";

const rootReducers = combineReducers({
    user: getUserReducer,
    loginReducer,
    registerReducer,
    resetPasswordReducer,
    logoutReducer,
    users: getUsersReducer,
    toggleSendFriendRequestReducer,
    friends: getFrinedsReducer,
    friendRequests: getFrinedRequestsReducer,
    acceptRequest: acceptFriendRequestReducer,
    sendChatReducer,
    chats: getChatsReducer,
    removeFriendReducers,
    getChatIdReducer,
    createChatReducer,
    sendMessageReducer,
    getMessagesReducer,
    deleteMessageReducer,
});

const store = createStore(rootReducers, applyMiddleware(thunk))

export default store;