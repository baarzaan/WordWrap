import ChatScreen from "@/screens/ChatScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";

export const routes = [
  { path: "/", element: <HomeScreen />, isPrivate: true },

  { path: "/login", element: <LoginScreen />, isPrivate: false },

  { path: "/register", element: <RegisterScreen />, isPrivate: false },

  { path: "/forgot-password", element: <ForgotPasswordScreen />, isPrivate: false },

  { path: "/c/:friendUsername", element: <ChatScreen />, isPrivate: true },
];
