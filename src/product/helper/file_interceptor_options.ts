import { BadRequestException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";

export const fileInterceptorOptionsHelper: MulterOptions = {
    storage: diskStorage({
      destination: './public',
      filename: (req, file, cb) => {
        cb(null, `${Date.now()} - ${file.originalname}`);
      },
    }),
    fileFilter(req, file, cb) {
      if (['image/png', 'image/jpeg'].includes(file.mimetype)) {
        cb(null, true);
      } else {
        return cb(
          new BadRequestException(
            'Arquivos desta extensão não são permitidos',
          ),
          false,
        );
      }
    },
    limits: {
      fileSize: 2000000,
    },
  }