import request from '/@/utils/request';
const role = 'http://localhost:8000/role'

export function Api() {
  return {
    role: (params: object) => {
      return request({
        url: role,
        method: 'post',
        data: params,
      });
    },


  };
}
export default Api
