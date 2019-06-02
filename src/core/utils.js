import jwtDecode from 'jwt-decode'

export const getUserInfo = (token) => {
  return jwtDecode(token)
}

export function generateRandom () {
  return Math.random().toString().substring(2, 10)
}