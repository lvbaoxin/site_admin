const base_url = 'http://localhost:8000/'

const API = {
   role: {
      list: base_url + 'role/list',
   },
   blog: base_url + 'blog/',
   user: {
      list: base_url + 'user/list',
      login: base_url + 'user/login',
   },
}

export default API

