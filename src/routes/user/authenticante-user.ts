import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { ClientError } from '../../errors/client-error'
import { compare } from 'bcryptjs'

export async function authenticateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/user/auth',
    {
      schema: {
        body: z.object({
          email: z
            .string()
            .email()
            .transform((email) => {
              return email.toLocaleLowerCase()
            }),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        throw new ClientError('Email or password is wrong.')
      }

      const passwordMatch = await compare(password, user.password)

      if (!passwordMatch) {
        throw new ClientError('Email or password is wrong.')
      }

      const token = await reply.jwtSign({ sign: { sub: user.id } })

      const refreshToken = await reply.jwtSign({
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      })

      return reply
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          httpOnly: true,
        })
        .status(200)
        .send({
          token,
        })
    },
  )
}
