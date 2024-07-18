import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function deleteLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/links/:linkId',
    {
      schema: {
        params: z.object({
          linkId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { linkId } = request.params

      await prisma.link.delete({
        where: {
          id: linkId,
        },
      })

      return reply.status(200).send()
    },
  )
}
