import { useEffect } from "react";
import { useApi } from "../components/user-logic/api";
import { useAuth } from "../components/user-logic/auth-context";

export function useInitAuth() {
  console.log("usetinit до useeffect");
  const { state } = useAuth();
  const { refreshToken } = useApi();

  useEffect(() => {
    async function checkAuth() {
      if (!state.accessToken) {
        try {
          console.log("usetinit после useeffect");
          await refreshToken();
        } catch (error) {
          console.log("ошибка в обновлении токена");
        }
      }
    }

    checkAuth();
  }, []);
}
