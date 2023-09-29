import { type Request, type Response, type NextFunction } from 'express'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-headers', '*')
  res.set('access-control-allow-methods', '*')
  res.set('access-control-allow-origin', '*')
  next()
}
