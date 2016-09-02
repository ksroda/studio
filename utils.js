export function transformMenu (menu, role) {
  return menu.reduce((acc, curr) => {
    const filteredSubmenu = curr.submenu
      ? curr.submenu.filter(item => item.access && item.access.includes(role))
      : []
    if (filteredSubmenu.length > 0) {
      return [...acc, { ...curr, submenu: filteredSubmenu }]
    } else {
      const canAccess = curr.access
        ? curr.access.includes(role)
        : false
      return canAccess ? [...acc, curr] : acc
    }
  }, [])
}

export function getSubmenus (menu) {
  return menu.reduce((acc, curr) => ({
    ...acc,
    ...(
      curr.target
        ? { [curr.target]: false }
        : null
    )
  }), [])
}
