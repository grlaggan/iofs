import { useAuth } from "./auth-context";

export function useApi() {
  const { state, dispatch } = useAuth();

  async function refreshToken() {
    if (state.isRefreshing) {
      await new Promise((resolve) => {
        const timer = setInterval(() => {
          if (!state.isRefreshing) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
      return state.accessToken;
    }

    dispatch({ type: "REFRESH_START" });

    try {
      const response = await fetch("http://127.0.0.1:5000/api/token/refresh/", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ refresh: localStorage.getItem("refresh") }),
      });
      const { access, user } = await response.json();
      console.log(access);
      console.log(user);

      dispatch({
        type: "REFRESH_SUCCESS",
        payload: access,
        user: user,
      });
      return access;
    } catch (error) {
      dispatch({ type: "LOGOUT" });
      throw error;
    }
  }

  async function makeRequest(url, options) {
    try {
      return await fetch(url, {
        credentials: "include",
        headers: {
          ...options.headers,
          Authorization: `Bearer ${state.accessToken}`,
        },
      });
    } catch (error) {
      if (error.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const newAccessToken = await refreshToken();

        return fetch(url, {
          credentials: "include",
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      }
      throw error;
    }
  }

  async function checkAuth() {
    if (state.accessToken) return true;

    try {
      await refreshToken();
      return true;
    } catch {
      return false;
    }
  }

  return { makeRequest, checkAuth, refreshToken };
}
