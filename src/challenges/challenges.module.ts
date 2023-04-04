import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema } from './interfaces/challenge.schema';
import { ProxyRmqModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: "Challenge", schema: ChallengeSchema }]),
    ProxyRmqModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService]
})
export class ChallengesModule { }
