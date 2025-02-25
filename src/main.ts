import { NestApplication, NestFactory } from '@nestjs/core'
// import * as fs from 'fs-extra'
// import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
   const PORT = process.env.PORT || 8000

   // const httpsOptions = {
   //    key: fs.readFileSync('secret/privkey.pem'),
   //    cert: fs.readFileSync('secret/cert.pem')
   // }

   const graphqlUploadExpress = (await import('graphql-upload/graphqlUploadExpress.mjs')).default

   // const app = await NestFactory.create<NestApplication>(AppModule, { httpsOptions })
   const app = await NestFactory.create<NestApplication>(AppModule)

   app.use(cookieParser())
   app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }))

   const corsOptions = {
      // origin: 'https://localhost:3000',
      origin: 'https://app.navalista.com',
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization'
   }

   app.enableCors(corsOptions)

   await app.listen(PORT).then(() => console.log(`App run on https://127.0.0.1:${PORT}`))
}
bootstrap()
