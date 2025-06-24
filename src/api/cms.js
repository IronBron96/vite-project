// src/api/cms.js
import { createDirectus, authentication, rest, readMe } from '@directus/sdk'

const directus = createDirectus('https://directus-thomas.webcloud.cloud/')
  .with(
    authentication('json', {
      autoRefresh: true,
      storage: {
        get: key => Promise.resolve(localStorage.getItem(key)),
        set: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
        delete: key => Promise.resolve(localStorage.removeItem(key)),
      },
    })
  )
  .with(rest())

export const loginIfNeeded = async () => {
  try {
    // login con email e password (forma corretta)
    const response = await directus.login(
      'soraferronato@gmail.com',
      'S6cd7qsjmmxkDLuDv4Udz42hjH496sLtKYkzJjwXmRqDCj2fWq'
    )

    directus.setToken(response.access_token)
    localStorage.setItem('auth_token', response.access_token)
  } catch (loginError) {
    console.error('Login fallito:', loginError)
    throw loginError
  }
}

export const getCurrentUser = async () => {
  await loginIfNeeded()
  const user = await directus.request(readMe({ fields: ['id'] }))
  return user.id
}

export default directus
