export function getAdminMenu() {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve([
        {
          name: '首页',
          path: '/home',
          icon: 'ant-DashboardOutlined',
          sort: 0,
          cache: 1,
          hide: 0,
        },
      ])
    }, 10)
  })
}

export function getUserMenu() {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve([
        {
          name: 'home',
          path: '/home',
        },
      ])
    }, 1000)
  })
}
