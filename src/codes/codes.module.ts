import { Module } from '@nestjs/common';
import { CodesController } from './codes.controller';
import { CodesService } from './codes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Codes } from './codeschema';
import { User, UserSchema } from 'src/users/userschema';
import { Counter, CounterSchema } from './counterschema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Code', schema: Codes },
      { name: User.name, schema: UserSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [CodesController],
  providers: [CodesService],
})
export class CodesModule {}
