import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(readonly service: FilesService) {}

  @Get('buckets')
  @ApiOperation({
    summary: 'List all buckets',
    description: 'Returns a list of all available MinIO buckets',
  })
  @ApiOkResponse({ description: 'List of buckets retrieved successfully' })
  bucketsList() {
    return this.service.bucketsList();
  }

  @Get('file-url/:name')
  @ApiOperation({
    summary: 'Get file URL',
    description: 'Returns a presigned URL to access a specific file',
  })
  @ApiParam({ name: 'name', description: 'Name of the file to retrieve' })
  @ApiOkResponse({ description: 'File URL retrieved successfully' })
  getFile(@Param('name') name: string) {
    return this.service.getFile(name);
  }

  @Post('upload')
  @ApiOperation({
    summary: 'Upload a file',
    description: 'Upload a file to MinIO storage',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        filename: { type: 'string', description: 'Original filename' },
        size: { type: 'number', description: 'File size in bytes' },
        url: { type: 'string', description: 'URL to access the uploaded file' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile('file') file: Express.Multer.File) {
    return this.service.uploadFile(file);
  }
}
