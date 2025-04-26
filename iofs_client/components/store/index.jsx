import { makeAutoObservable } from "mobx";
import AuthService from "../services/auth_service";
import axios from "axios";

export default class Store {
  user = {};
  isAuth = false;
  urlPosts = "ws://127.0.0.1:5000/posts/";
  cachedPost = {};
  loadUserLogin = false;
  categories = [];
  errorAuth = false;
  errorReg = false;

  constructor() {
    makeAutoObservable(this);
  }

  setErrorReg(value) {
    this.errorReg = value;
  }

  setErrorAuth(value) {
    this.errorAuth = value;
  }

  setCachedPost(post) {
    this.cachedPost = { ...this.cachedPost, ...post };
  }

  setUser(user) {
    this.user = { ...this.user, ...user };
  }

  setLoadUserLogin(value) {
    this.loadUserLogin = value;
  }

  setIsAuth(value) {
    this.isAuth = value;
  }

  setUrlPosts(url) {
    this.urlPosts = url;
  }

  setCategories(categories) {
    this.categories = categories;
  }

  async login(username, password) {
    try {
      const response = await AuthService.login(username, password);
      localStorage.setItem("token", response.data.access);
      this.setUser(response.data.user);
      console.log(this.user);
      this.setIsAuth(true);
      this.setLoadUserLogin(false);
    } catch (error) {
      this.setLoadUserLogin(false);
      this.setErrorAuth(true);
      console.log(error.response);
    }
  }

  async registration(username, password1, password2) {
    try {
      await AuthService.registration(username, password1, password2);
      alert("Успешная регистрация!");
    } catch (error) {
      this.setErrorReg(true);
      console.log(error.response?.data);
    }
  }

  async logout() {
    try {
      await AuthService.logout();

      debugger;
      localStorage.removeItem("token");
      this.setUser({});
      this.setIsAuth(false);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  }

  async change(formData) {
    try {
      const response = await AuthService.change(formData);

      this.setUser(response.data);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  }

  async changePassword(password, newPassword, confirmPassword) {
    try {
      const response = await AuthService.changePassword(
        password,
        newPassword,
        confirmPassword
      );
      this.setUser(response.data);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  }

  async checkAuth() {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/login/refresh/",
        {},
        { withCredentials: true }
      );

      localStorage.setItem("token", response.data.access);
      this.setUser(response.data.user);
      this.setIsAuth(true);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  }
}
