import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MatchsModule } from './matchs/matchs.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [MongooseModule.forRootAsync(
    {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const MG_USER = configService.get<string>('MG_USER')
        const MG_PASSWORD = configService.get<string>('MG_PASSWORD')
        const MG_URL = configService.get<string>('MG_URL')
        const MG_DB_NAME = configService.get<string>('MG_DB_NAME')
        const uri = `mongodb://${MG_USER}:${MG_PASSWORD}@${MG_URL}`
        return {
          uri,
          dbName: MG_DB_NAME
        }
      }
    }
  ),
  ConfigModule.forRoot({ isGlobal: true }),
    MatchsModule,
    ChallengesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
