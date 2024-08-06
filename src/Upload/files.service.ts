import * as fs from 'fs'
import { Stats } from 'fs'
import { FileUpload } from 'graphql-upload/GraphQLUpload.mjs'
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
}
