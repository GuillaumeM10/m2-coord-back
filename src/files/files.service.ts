import { HttpException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as Minio from 'minio';
import { InjectMinio } from 'src/minio/minio.decorator';

@Injectable()
export class FilesService {
  protected _bucketName = 'main';

  constructor(@InjectMinio() private readonly minioService: Minio.Client) {
    this.minioService
      .bucketExists(this._bucketName)
      .then((exists) => {
        if (!exists) {
          return this.minioService
            .makeBucket(this._bucketName)
            .then(() => this.setBucketPolicy());
        } else {
          return this.setBucketPolicy();
        }
      })
      .catch((err) => console.error('Error initializing bucket:', err));
  }

  private setBucketPolicy() {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this._bucketName}/*`],
        },
      ],
    };

    return this.minioService.setBucketPolicy(
      this._bucketName,
      JSON.stringify(policy),
    );
  }

  async bucketsList() {
    return await this.minioService.listBuckets();
  }

  async getFile(filename: string) {
    return await this.minioService.presignedUrl(
      'GET',
      this._bucketName,
      filename,
    );
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File not found', 400);
    }

    const uploadedFiles = new Promise((resolve, reject) => async () => {
      file.originalname = file.originalname.replace(/ /g, '_');
      file.originalname = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '');

      const filename = `${randomUUID().toString()}-${file.originalname}`;

      await this.minioService.putObject(
        this._bucketName,
        filename,
        file.buffer,
        file.size,

        (error) => {
          if (error) {
            // TODO: Fix typing
            // eslint-disable-next-line
            reject(error);
          } else {
            resolve({ filename }); // Pass filename to resolve
          }
        },
      );
    });

    return (
      uploadedFiles
        // TODO: Fix typing
        .then((result: any) => {
          return {
            filename: file.originalname,
            size: file.size,
            // eslint-disable-next-line
            url: `http://localhost:9000/${this._bucketName}/${result.filename}`, // Use the filename with UUID
          };
        })
        .catch((error) => {
          // TODO: Fix typing
          // eslint-disable-next-line
          throw new HttpException(error, 500);
        })
    );
  }
}
