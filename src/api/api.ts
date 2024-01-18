const base_url = 'http://localhost:8000/'

const API = {
   role: {
      list: base_url + 'role/list',
   },
   blog: {
      list: base_url + 'blog/list',
      add: base_url + 'blog/add',
      update: base_url + 'blog/update',
      delete: base_url + 'blog/delete',
      listPage: base_url + 'blog/listPage',
   },
   user: {
      list: base_url + 'user/list',
      login: base_url + 'user/login',
   },
   blogcategory: {
      list: base_url + 'blogcategory/list',
      add: base_url + 'blogcategory/add',
      update: base_url + 'blogcategory/update',
      delete: base_url + 'blogcategory/delete',
      listPage: base_url + 'blogcategory/listPage',
   },
}

export default API

