import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs'
import { FilesService } from './files.service'
import { FileResponse, FileType } from 'src/graphql/models/FileType'

@Resolver()
export class FilesResolver {
   constructor(private filesService: FilesService) {}

   @Mutation(() => FileType)
   async uploadFile(
      @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload
   ): Promise<Record<string, string>> {
      return await this.filesService.uploadFileStream(file)
   }

   @Query(() => FileResponse, { nullable: true })
   async getFile(
      @Args({ name: 'filePath' }) filePath: string,
      @Args({ name: 'fileName' }) fileName: string
   ): Promise<FileResponse> {
      const { size, buffer } = await this.filesService.getFile(filePath, fileName)

      return {
         fileName,
         size,
         buffer
      }
   }
}
