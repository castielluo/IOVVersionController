import axios from 'axios'
import {Notice} from 'iview'
export default{
  install (Vue, options) {
    Vue.prototype.get = function (url, getData = {}) {
      return new Promise(function (resolve, reject) {
        axios.get(url, { params: getData })
          .then(function (res) {
            resolve(res)
            console.log(res)
            if (res.data.code === 501) {
              window.sessionStorage.setItem('token', '')
              Notice.open({
                title: '通知',
                desc: '账号被重复登录，请退出后重新登录'
              })
            }
          })
          .catch(function (ret) {
            console.log(ret)
            reject(ret)
          })
      })
    }
    Vue.prototype.post = function (url, getData = {}) {
      return new Promise(function (resolve, reject) {
        axios.post(url, getData)
          .then(function (res) {
            resolve(res)
            console.log(res)
            if (res.data.code === 501) {
              window.sessionStorage.setItem('token', '')
              Notice.open({
                title: '通知',
                desc: '账号被重复登录，请退出后重新登录'
              })
            }
          })
          .catch(function (ret) {
            console.log(ret)
            reject(ret)
          })
      })
    }
    Vue.prototype.haveRight = function (id) {
      // console.log(id)
      if (parseInt(window.sessionStorage.getItem('memberId')) === id) {
        return true
      } else {
        return false
      }
    }
  }
}
