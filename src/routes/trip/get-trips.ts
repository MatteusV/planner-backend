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
    async (request) => {
      const { userId } = request.params

      const trips = await prisma.trip.findMany({
        where: {
          user_id: userId,
        },
        select: {
          id: true,
          destination: true,
          ends_at: true,
          starts_at: true,
          is_confirmed: true,
        },
      })

      if (!trips) {
        throw new ClientError('Trips not found.')
      }

      return { trips }
    },
  )
}
