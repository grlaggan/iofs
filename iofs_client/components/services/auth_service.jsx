import axios from "axios";
import $api from "../http";

export default class AuthService {
  static async login(username, password) {
    return axios.post(
      "http://127.0.0.1:5000/api/login/",
      { username, password },
      { withCredentials: true }
    );
  }

  static async logout() {
    return axios.get("http://127.0.0.1:5000/api/logout/", {
      withCredentials: true,
    });
  }

  static async registration(username, password1, password2) {
    return axios.post("http://127.0.0.1:5000/users/", {
      username: username,
      password1: password1,
      password2: password2,
    });
  }

  static async change(formData) {
    return $api.post("http://127.0.0.1:5000/users/change/", formData);
  }

  static async changePassword(password, newPassword, confirmPassword) {
    return $api.post("http://127.0.0.1:5000/users/change/password/", {
      password: password,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  }
}
