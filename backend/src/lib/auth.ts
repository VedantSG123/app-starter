import { betterAuth } from 'better-auth'
import { Elysia } from 'elysia'

import { getPool } from '../utils/db'
import { sendAuthEmail } from './resend'

export const auth = betterAuth({
  database: getPool(),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthEmail(user.email, 'signup', url)
    },
    autoSignInAfterVerification: true,
  },
})

export const betterAuthPlugin = new Elysia({ name: 'better-auth' })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, set, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        })

        if (!session) {
          set.headers['response-origin'] = 'replai-cad-backend'
          return status(401)
        }

        return {
          user: session.user,
          session: session.session,
        }
      },
    },
  })
