import { MongoHelper } from '../infra/cryptography/db/mongodb/helpers/mongo-helper'
import app from './config/app'
import env from './config/env'

MongoHelper.connect(env.mongoUrl).then(() => {
  app.listen(env.port, () => { console.log(`server running at: http://localhost:${env.port}`) })
}).catch(error => {
  console.error(error)
})
