export const loadAuth = () => {
  if (localStorage.getItem('access_token')) {
    return {access_token: localStorage['access_token'], refresh_token: localStorage['refresh_token']}
  }

  removeTokens()
  return null
}

export const setTokens = (data) => {
  localStorage.setItem('access_token', data.access_token)
  localStorage.setItem('refresh_token', data.refresh_token)
}

export const removeTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}