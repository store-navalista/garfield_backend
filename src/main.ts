// import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { NestApplication, NestFactory } from '@nestjs/core'
// import * as fs from 'fs-extra'
// import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
   const PORT = process.env.PORT || 8879

   // const httpsOptions = {
   //    key: fs.readFileSync('secret/key.pem'),
   //    cert: fs.readFileSync('secret/cert.pem')
   // }

   const graphqlUploadExpress = (await import('graphql-upload/graphqlUploadExpress.mjs')).default

   //  const app = await NestFactory.create(AppModule, {httpsOptions});
   const app = await NestFactory.create<NestApplication>(AppModule)
   app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }))

   // const corsOptions: CorsOptions = {
   //    origin: [
   //      'https://www.keelwards.com',
   //      'https://keelwards.com',
   //    ],
   //    credentials: true
   //  };

   //  app.enableCors(corsOptions);

   app.enableCors()
   app.use(cookieParser())

   await app.listen(PORT).then(() => console.log(`App run on https://localhost:${PORT}`))
}
bootstrap()
