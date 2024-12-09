import { spawn } from 'child_process'
import * as fs from 'fs'
import { Stats } from 'fs'
import { FileUpload } from 'graphql-upload/GraphQLUpload.mjs'
import * as nodemailer from 'nodemailer'
import * as os from 'os'
import * as path from 'path'
import { CatchError } from 'src/common/decorators/ErrorHandling'
import { FileResponse } from 'src/graphql/models/FileType'

export class FilesService {
   private async _getFileBuffer(fullPath: string): Promise<Buffer> {
      return new Promise((resolve, reject) => {
         fs.readFile(fullPath, (err, data) => {
            if (err) {
               reject(err)
            } else {
               resolve(data)
            }
         })
      })
   }

   private async _getFileStat(fullPath: string): Promise<Stats['size']> {
      return new Promise((resolve, reject) => {
         fs.stat(fullPath, (err, data) => {
            if (err) {
               reject(err)
            } else {
               resolve(data.size)
            }
         })
      })
   }

   @CatchError('Failed upload file')
   async uploadFileStream(file: FileUpload): Promise<Record<string, string>> {
      const { createReadStream, filename } = file
      const uploadPath = path.join(__dirname, '..', 'uploads', filename)

      return new Promise((resolve, reject) => {
         const stream = createReadStream()
         const writeStream = fs.createWriteStream(uploadPath)

         stream
            .pipe(writeStream)
            .on('finish', () => resolve({ filePath: uploadPath }))
            .on('error', (error) => reject(error))
      })
   }

   @CatchError('Failed to get file')
   async getFile(filePath: string, fileName: string): Promise<Omit<FileResponse, 'fileName'>> {
      const fullPath = path.join(__dirname, '../..', filePath, fileName)

      const buffer = await this._getFileBuffer(fullPath)
      const size = await this._getFileStat(fullPath)

      return { buffer: Buffer.from(buffer).toString('base64'), size }
   }

   @CatchError('Failed to get file')
   async backupDB(): Promise<void> {
      try {
         const dbName = process.env.DATABASE_NAME

         const now = new Date()
         const formattedDate = now
            .toLocaleString('ru-RU', {
               day: '2-digit',
               month: '2-digit',
               year: 'numeric',
               hour: '2-digit',
               minute: '2-digit'
            })
            .replace(/\./g, '.')
            .replace(/,/g, '')
            .replace(/\s/g, '_')

         const backupFilePath = path.join(os.tmpdir(), `navalista_crm_${formattedDate}.sql`)

         const pgDump = spawn('pg_dump', ['-U', 'postgres', '-f', backupFilePath, dbName], {
            env: {
               ...process.env,
               PGPASSWORD: process.env.POSTGRES_PASSWORD
            }
         })

         pgDump.stdout.on('data', (data) => {
            console.log(`pg_dump stdout: ${data.toString()}`)
         })

         pgDump.stderr.on('data', (data) => {
            console.error(`pg_dump stderr: ${data.toString()}`)
         })

         await new Promise<void>((resolve, reject) => {
            pgDump.on('error', (error) => {
               reject(new Error(`Failed to start pg_dump: ${error.message}`))
            })

            pgDump.on('close', (code) => {
               if (code === 0) {
                  resolve()
               } else {
                  reject(new Error(`pg_dump exited with code ${code}`))
               }
            })
         })

         const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
               user: process.env.MAIL_ACC,
               pass: process.env.MAIL_PASSWORD
            },
            tls: {
               rejectUnauthorized: false
            }
         })

         const mailOptions = {
            from: `"Navalista Support" <${process.env.MAIL_ACC}>`,
            to: process.env.MAIL_RECIPIENT_ACC,
            subject: 'Database Backup',
            text: 'The database backup file is attached.',
            attachments: [
               {
                  filename: `navalista_crm_${formattedDate}.sql`,
                  path: backupFilePath
               }
            ]
         }

         await new Promise<void>((resolve, reject) => {
            transporter.sendMail(mailOptions, (error) => {
               if (error) {
                  return reject(new Error(`Failed to send email: ${error.message}`))
               }
               resolve()
            })
         })

         fs.unlinkSync(backupFilePath)
      } catch (e) {
         console.log(e)
      }
   }
}
