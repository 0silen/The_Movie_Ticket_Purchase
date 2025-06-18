/*@Author: 西琳*/
/*@FileName: request.py*/
/*@DateTime: 2024/12/6 下午11:55*/
/* @SoftWare: PyCharm*/
/* jshint esversion: 6 */

import axios from 'axios';
import {ElMessage} from 'element-plus';

const service = axios.create({
    baseURL: '',  // 基础 API URL
    timeout: 5000,  // 请求超时时间
});



export default service;
