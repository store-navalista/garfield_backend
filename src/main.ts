// import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { NestApplication, NestFactory } from '@nestjs/core'
import * as fs from 'fs-extra'
// import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
   const PORT = process.env.PORT || 8879

   const httpsOptions = {
      key: fs.readFileSync('secret/privkey.pem'),
      cert: fs.readFileSync('secret/cert.pem')
   }

   const graphqlUploadExpress = (await import('graphql-upload/graphqlUploadExpress.mjs')).default

   const app = await NestFactory.create(AppModule, { httpsOptions })
   // const app = await NestFactory.create<NestApplication>(AppModule)
   app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }))

   const corsOptions = {
      origin: ['https://www.app.navalista.com', 'https://app.navalista.com'],
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization'
   }

   // app.enableCors(corsOptions)
   app.use(cookieParser())

   app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'https://www.app.navalista.com, https://app.navalista.com')
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization')
      res.header('Access-Control-Allow-Credentials', 'true')
      if (req.method === 'OPTIONS') {
         return res.sendStatus(204)
      }
      next()
   })

   await app.listen(PORT).then(() => console.log(`App run on https://localhost:${PORT}`))
}
bootstrap()
