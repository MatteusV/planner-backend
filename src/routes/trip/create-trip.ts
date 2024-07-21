import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { getEmailClient } from '../../lib/mail'
import nodemailer from 'nodemailer'
import { formattedDate } from '../../utils/formatted-date'
import { dayjs } from '../../lib/dayjs'
import { ClientError } from '../../errors/client-error'
import { env } from '../../env'
import { TokenDecoded } from '../../@types/token-decoded'
import { decode } from 'jsonwebtoken'

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips',
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          emails_to_invite: z.array(
            z.object({
              email: z
                .string()
                .email()
                .transform((email) => email.toLocaleLowerCase()),
              name: z.string(),
            }),
          ),
          token: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { destination, ends_at, starts_at, emails_to_invite, token } =
        request.body
      const tokenDecoded = decode(token) as TokenDecoded
      const { sub } = tokenDecoded.sign
      if (!sub) {
        throw new ClientError('User not authenticate.')
      }

      const user = await prisma.user.findUnique({
        where: {
          id: sub,
        },
      })

      if (!user) {
        return reply.status(400).redirect(env.WEB_BASE_URL)
      }

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new ClientError('Invalid trip start date.')
      }

      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new ClientError('Invalid trip end date.')
      }

      const trip = await prisma.trip.create({
        data: {
          user_id: sub,
          destination,
          ends_at,
          starts_at,
          participants: {
            createMany: {
              data: [
                ...emails_to_invite.map((user) => {
                  return { email: user.email, name: user.name }
                }),
              ],
            },
          },
        },
      })

      const { formattedEndDate, formattedStartDate } = formattedDate({
        ends_at: trip.ends_at,
        starts_at: trip.starts_at,
      })

      const confirmationLink = `${env.WEB_BASE_URL}/trips/${trip.id}/confirm`

      const mail = await getEmailClient()

      const message = await mail.sendMail({
        from: {
          name: 'Equipe plann.er',
          address: 'oi@plann.er',
        },
        to: {
          name: user!.name,
          address: user!.email,
        },

        subject: `Confirme sua viagem para ${destination}`,
        html: `
          <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
            <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
            <p></p>
            <p>Para confirmar sua viagem, clique no link abaixo:</p>
            <p></p>
            <p>
              <a href="${confirmationLink}">Confirmar viagem</a>
            </p>
            <p></p>
            <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
          </div>
        `.trim(),
      })

      console.log(nodemailer.getTestMessageUrl(message))

      return reply.status(201).send({ tripId: trip.id })
    },
  )
}
