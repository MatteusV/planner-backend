import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../lib/prisma'
import { ClientError } from '../../errors/client-error'
import z from 'zod'
import { decode } from 'jsonwebtoken'
import { TokenDecoded } from '../../@types/token-decoded'

export async function getUserByToken(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/user',
    {
      schema: {
        body: z.object({
          token: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { token } = request.body
      const tokenDecoded = decode(token) as TokenDecoded
      const { sub } = tokenDecoded.sign

      const user = await prisma.user.findUnique({
        where: {
          id: sub,
        },
        select: {
          email: true,
          id: true,
          name: true,
          image_url: true,
        },
      })

      if (!user) {
        throw new ClientError('User not found.')
      }
      reply.status(200).send({ user })
    },
  )
}
