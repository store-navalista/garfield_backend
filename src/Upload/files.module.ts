import { Module } from '@nestjs/common'
import { FilesResolver } from './files.resolver'
import { FilesService } from './files.service'
import { BufferScalar } from 'src/graphql/common/buffer.scalar'

@Module({
   providers: [FilesResolver, FilesService, BufferScalar]
})
export class UploadModule {}
