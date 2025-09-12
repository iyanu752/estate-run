import { Module } from '@nestjs/common';
import { CodesController } from './codes.controller';
import { CodesService } from './codes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Codes } from './codeschema';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Code', schema: Codes }])],
  controllers: [CodesController],
  providers: [CodesService],
})
export class CodesModule {}
