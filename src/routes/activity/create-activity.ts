import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { dayjs } from '../../lib/dayjs'
import { ClientError } from '../../errors/client-error'

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/activities',
    {
      schema: {
        body: z.object({
          title: z.string().min(4),
          occurs_at: z.coerce.date(),
        }),

        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { occurs_at, title } = request.body
      const { tripId } = request.params
      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      })

      if (!trip) {
        throw new ClientError('Trip not found.')
      }

      console.log({
        tripStart: trip.starts_at,
        occurs_at,
        tripEnd: trip.ends_at,
      })

      if (dayjs(occurs_at).isBefore(trip.starts_at)) {
        throw new ClientError('Invalid activity date.')
      }

      if (dayjs(occurs_at).isAfter(trip.ends_at)) {
        throw new ClientError('Invalid activity date.')
      }

      const activity = await prisma.activity.create({
        data: {
          occurs_at,
          title,
          trip_id: tripId,
        },
      })

      return reply.status(201).send({ activityId: activity.id })
    },
  )
}
