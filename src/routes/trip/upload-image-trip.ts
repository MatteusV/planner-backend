import { FastifyInstance, FastifyRequest } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { upload } from '../middlewares/fastify-multer'
import { ClientError } from '../../errors/client-error'
import { supabase } from '../../lib/supabase'
import { readFileSync, unlink } from 'fs'
import { prisma } from '../../lib/prisma'

interface FileInRequest extends FastifyRequest {
  file: {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    destination: string
    filename: string
    path: string
    size: number
  }
}

export async function uploadImageTrip(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .addHook('preHandler', upload.single('file'))
    .post(
      '/trips/upload/image/:tripId',
      {
        schema: {
          params: z.object({
            tripId: z.string().uuid(),
          }),
        },
      },
      async (request, reply) => {
        const { tripId } = request.params
        const { file } = request as FileInRequest

        const fileBuffer = readFileSync(file.path)

        if (!file) {
          return new ClientError('File not found.')
        }

        const { data, error } = await supabase.storage
          .from('pictures-trips')
          .upload(file.filename, fileBuffer, { contentType: 'image/*' })

        unlink(file.path, (error) => {
          if (error) {
            console.log(error)
          }
        })
        if (error) {
          return reply.status(500).send({ message: error.message })
        }

        const image = supabase.storage
          .from('pictures-trips')
          .getPublicUrl(data.path)

        try {
          await prisma.trip.update({
            where: {
              id: tripId,
            },
            data: {
              image_url: image.data.publicUrl,
            },
          })

          return reply
            .status(200)
            .send({ message: 'Image uploaded successfully' })
        } catch (error) {
          throw new ClientError(`${error}`)
        }
      },
    )
}
