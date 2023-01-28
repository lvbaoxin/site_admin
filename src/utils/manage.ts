
import service  from '../../src/utils/request'
import axios from "axios";
const request = {

//post
 postAction(url:any,parameter:any,headers:any) {
  return axios({
    url: url,
    method:'post' ,
    data: parameter,
    headers:headers

  })
},

//post method= {post | put}
 httpAction(url:any,parameter:any,headers:any) {
  let signHeader = {"X-Sign": "sign","X-TIMESTAMP": "signMd5Utils.getTimestamp()"
  };
  return axios({
    url: url,
    method:"post" ,
    data: parameter,
   // headers: signHeader
  })
},
//put
putAction(url:any,parameter:any,headers:any) {
  return axios({
    url: url,
    method:'put',
    data: parameter
  })
},
//get
getAction(url:any,parameter:any,headers:any) {
  let signHeader = {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6IkFVVEgiLCJleHAiOjE2NjgwNDk1MTIsInVzZXJJZCI6IjI4MDI2ODcxIiwiaWF0IjoxNjY4MDQyMzEyfQ.MSjgzoFa_12Q99YwBm3_3o0_q5zyngUySb5iu4aqhSM",
  "Content-Type":'application/json'
  };
  return axios({
    url: url,
    method: 'get',
    params: parameter,
    // headers: {
    //   "Content-Type":'application/json',
    //   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6IkFVVEgiLCJleHAiOjE2Njc3OTEyOTAsInVzZXJJZCI6ImluZ3JpZC56aGFuZ0Bub3ZhcnRpcy5jb20iLCJpYXQiOjE2Njc3ODQwOTB9.ZvCaN6rFq4xQuTY7rl8tDR8poQiKE0e7l1twfZsqkGY"
    // }
    headers:headers
    //   headers: {
    //       "Authorization": Tools.getStore('token')
    //   }
  })
},
//deleteAction
 deleteAction(url:any,parameter:any,headers:any) {
  return axios({
    url: url,
    method: 'delete',
    params: parameter
  })
}
}
export default request