/*@Author: 西琳*/
/*@FileName: api.py*/
/*@DateTime: 2024/12/6 下午11:54*/
/* @SoftWare: PyCharm*/
/* jshint esversion: 6 */
// src/utils/api.js
import request from '/src/utils/request';  // 引入封装好的 request

// 获取电影列表
export function fetchFilms() {
    return request({
        url: '/api/Film/List',
        method: 'GET',
    });
}

// 用户登录
export function login(data) {
    return request({
        url: '/api/User/Login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // 设置请求头为 JSON 格式
        },
        data: data,
    });
}

// 用户注册
export function register(data) {
    return request({
        url: '/api/User/Register',
        method: 'POST',
        data,
    });
}

// 获取上映信息
export function fetchShowing() {
    return request({
        url: '/api/Showing/ShowingList',
        method: 'GET',
    });
}
export function fetchTicket() {
    return request({
        url: 'api/Ticket/TicketList',
        method: 'GET',
    });
}
// 提交购票信息
export function buyTicket(data) {
    return request({
        url: '/api/Ticket/Buy',
        method: 'POST',
        data,
    });
}
