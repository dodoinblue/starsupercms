import { applyDecorators, HttpStatus, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FILE_UPLOAD } from '../config/configurations';
import { CustomError, ErrCodes } from '../errors/errors';
import mkdirp from 'mkdirp';

export function SaveUploadToLocal(fileKey = 'file') {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
          description: {
            type: 'string',
          },
        },
      },
    }),
    UseInterceptors(
      FileInterceptor(fileKey, {
        storage: diskStorage({
          destination: FILE_UPLOAD.local.rootPath,
          filename: (_, file, callback) => {
            const fileExtName = extname(file.originalname);
            const subFolderPath = dayjs().format('YYYY-MM-DD');
            mkdirp.sync(join(FILE_UPLOAD.local.rootPath, subFolderPath));
            const fullFileName = join(subFolderPath, dayjs().format('HH_mm_ss_SSS') + fileExtName);
            callback(null, `${fullFileName}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            throw new CustomError(
              ErrCodes.INVALID_IMG_FORMAT,
              'Only image files are allowed!',
              HttpStatus.BAD_REQUEST,
            );
          }
          callback(null, true);
        },
      }),
    ),
  );
}
