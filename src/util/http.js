import axios from 'axios'
import {store} from "../redux/store";

axios.defaults.baseURL="http://localhost:8080"
// axios.defaults.baseURL="http://localhost:8000"

// axios.defaults.headers

// axios.interceptors.request.use
// axios.interceptors.response.use

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 显示loading
    store.dispatch({
        type:"change_loading",
        payload:true
    })

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // 隐藏loading
    store.dispatch({
        type:"change_loading",
        payload:true
    })
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });