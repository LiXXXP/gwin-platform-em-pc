import Cookies from 'js-cookie'

const TokenKey = 'gwin-token'
const RoleKey = 'gwin-roles'
const USER_ID_KEY = 'userId'
const ENTITY_ID_KEY = 'entityId'

export function getToken(): string | undefined {
  return Cookies.get(TokenKey)
}

export function setToken(token: string): string | undefined {
  return Cookies.set(TokenKey, token)
}

export function removeToken(): void {
  return Cookies.remove(TokenKey)
}

export function getRoles(): string | undefined {
  return Cookies.get(RoleKey)
}

export function setRoles(role: string): string | undefined {
  return Cookies.set(RoleKey, role)
}

export function getUserId(): string | undefined {
  return Cookies.get(USER_ID_KEY)
}

export function getEntityId(): string | undefined {
  return Cookies.get(ENTITY_ID_KEY)
}
