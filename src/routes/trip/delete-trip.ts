import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function deleteTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/trips/:tripId',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params

      try {
        await prisma.$transaction([
          prisma.participant.deleteMany({
            where: {
              trip_id: tripId,
            },
          }),
          prisma.link.deleteMany({
            where: {
              trip_id: tripId,
            },
          }),
          prisma.activity.deleteMany({
            where: {
              trip_id: tripId,
            },
          }),
          prisma.trip.delete({
            where: {
              id: tripId,
            },
          }),
        ])

        return reply.status(200).send()
      } catch (error) {
        return reply.status(400).send()
      }
    },
  )
}
