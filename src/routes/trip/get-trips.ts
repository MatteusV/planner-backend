import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { ClientError } from '../../errors/client-error'

export async function getTrips(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:userId/',
    {
      schema: {
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.params

      const trips = await prisma.trip.findMany({
        where: {
          user_id: userId,
        },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      if (!trips) {
        throw new ClientError('Trips not found.')
      }

      return reply.status(200).send({ trips })
    },
  )
}
