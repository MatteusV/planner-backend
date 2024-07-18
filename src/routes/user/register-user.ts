import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { ClientError } from '../../errors/client-error'
import { hash } from 'bcryptjs'

export async function registerUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/user/register',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(4),
        }),
      },
    },
    async (request, reply) => {
      const { email, name, password } = request.body

      const passwordHash = await hash(password, 8)

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: passwordHash,
        },
      })

      if (!user) {
        throw new ClientError('Error registering user.')
      }

      return reply.status(201).send({ userId: user.id })
    },
  )
}
