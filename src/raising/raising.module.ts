import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RaisingController } from './controllers/raising.controller';
import { RaisingSchema, Raising } from './schemas/raising.schema';
import { RaisingService } from './service/raising.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Raising.name, schema: RaisingSchema }]),
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    cb(null, `${uniqueSuffix}-${file.originalname}`);
                }
            })
        })
    ],
    controllers: [RaisingController],
    providers: [RaisingService],
})
export class RaisingModule { }