export const paths = {
  about : '/about',
  main: '/#/',
  form: {
    self: '/form',
    login: 'login',
    registration: 'registration'
  },
  edu: {
    self: '/edu',
    task: {
      page: 'task/page/:spec',
      add: 'task/add',
      edit: 'task/edit/:spec',
      list: ''
    },
    assignment: {
      page: 'assignment/page/:spec',
      add: 'assignment/add',
      edit: 'assignment/edit/:spec',
      list: 'assignment/list'
    }
  },
}
