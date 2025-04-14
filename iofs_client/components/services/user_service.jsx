import axios from "axios";
import $api from "../http";

export default class UserService {
  static async getItems(url) {
    return axios.get(url);
  }

  static async getItemsAuth(url, abortController) {
    return $api.get(url, { signal: abortController.signal });
  }
}
