import type { User, AuthState } from "@/types/auth.types";

export type AuthAction =
    | { type: "LOGIN_START" }
    | {
          type: "LOGIN_SUCCESS";
          payload: { user: User; accessToken: string; refreshToken: string; isTeacher: boolean };
      }
    | { type: "LOGIN_FAILURE"; payload: string }
    | { type: "REGISTER_START" }
    | { type: "REGISTER_SUCCESS" }
    | { type: "REGISTER_FAILURE"; payload: string }
    | { type: "LOGOUT" }
    | { type: "CLEAR_ERROR" }
    | { type: "AUTH_CHECK_COMPLETE" };

export const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    isTeacher: false,
};

export const authReducer = (
    state: AuthState,
    action: AuthAction
): AuthState => {
    switch (action.type) {
        case "LOGIN_START":
            return { ...state, isLoading: true, error: null };
        case "LOGIN_SUCCESS":
            return {
                ...state,
                user: action.payload.user,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                isTeacher: action.payload.isTeacher,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case "LOGIN_FAILURE":
            return { ...state, isLoading: false, error: action.payload };
        case "REGISTER_START":
            return { ...state, isLoading: true, error: null };
        case "REGISTER_SUCCESS":
            return { ...state, isLoading: false, error: null };
        case "REGISTER_FAILURE":
            return { ...state, isLoading: false, error: action.payload };
        case "LOGOUT":
            return { ...initialState, isLoading: false };
        case "CLEAR_ERROR":
            return { ...state, error: null };
        case "AUTH_CHECK_COMPLETE":
            return { ...state, isLoading: false };
        default:
            return state;
    }
};
