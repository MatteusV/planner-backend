import { Jwt } from 'jsonwebtoken'

export interface TokenDecoded extends Jwt {
  sign: {
    sub: string
  }
  iat: number
  exp: number
}
