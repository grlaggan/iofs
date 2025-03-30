import { createContext, useContext, useReducer } from "react";

export const AuthContext = createContext();

const initialState = {
  accessToken: null,
  userData: null,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        accessToken: action.payload,
        userData: action.user,
      };
    case "REFRESH_START":
      return {
        ...state,
        userData: action.user,
      };
    case "REFRESH_SUCCESS":
      return {
        ...state,
        accessToken: action.payload,
        userData: action.user,
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
