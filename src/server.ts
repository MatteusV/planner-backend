import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'

import { createTrip } from './routes/trip/create-trip'
import { confirmTrip } from './routes/trip/confirm-trip'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { confirmParticipant } from './routes/participant/confirm-participant'
import { createActivity } from './routes/activity/create-activity'
import { getActivities } from './routes/activity/get-actvities'
import { createLink } from './routes/link/create-link'
import { getLinks } from './routes/link/get-links'
import { getParticipants } from './routes/participant/get-participants'
import { createInvite } from './routes/invite/create-invite'
import { updateTrip } from './routes/trip/update-trip'
import { getTripDetails } from './routes/trip/get-trip-details'
import { getParticipant } from './routes/participant/get-participant'
import { errorHandler } from './error-handler'
import { env } from './env'
import { deleteParticipant } from './routes/participant/delete-participant'
import { deleteLink } from './routes/link/delete-link'
import { getTrips } from './routes/trip/get-trips'
import { registerUser } from './routes/user/register-user'
import { authenticateUser } from './routes/user/authenticante-user'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: '*',
})

app.register(fastifyCookie)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.setErrorHandler(errorHandler)

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipant)
app.register(createActivity)
app.register(getActivities)
app.register(createLink)
app.register(getLinks)
app.register(getParticipants)
app.register(createInvite)
app.register(updateTrip)
app.register(getTripDetails)
app.register(getParticipant)
app.register(deleteParticipant)
app.register(deleteLink)
app.register(getTrips)
app.register(registerUser)
app.register(authenticateUser)

app.listen({ host: '0.0.0.0', port: env.PORT ?? 3333 }).then(() => {
  console.log('Server is running')
})
