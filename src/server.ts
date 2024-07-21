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
import { getUserByToken } from './routes/user/get-user-by-token'
import { deleteTrip } from './routes/trip/delete-trip'

const app = fastify()

app.register(cors, {
  origin: '*',
})

app.register(fastifyCookie, {
  secret: 'planner-secret',
  algorithm: '',
})
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
  decode: { complete: true },
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

// participants
app.register(confirmParticipant)
app.register(getParticipants)
app.register(deleteParticipant)
app.register(getParticipant)

// users
app.register(registerUser)
app.register(authenticateUser)
app.register(getUserByToken)

// activities
app.register(createActivity)
app.register(getActivities)

// trips
app.register(deleteTrip)
app.register(getTrips)
app.register(createTrip)
app.register(confirmTrip)
app.register(updateTrip)
app.register(getTripDetails)
app.register(createInvite)

// links
app.register(createLink)
app.register(getLinks)
app.register(deleteLink)

app.listen({ host: '0.0.0.0', port: env.PORT ?? 3333 }).then(() => {
  console.log('Server is running')
})
