import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import * as momentTimezone from 'moment-timezone'

const logger = new Logger('Main')
const configService = new ConfigService()

async function bootstrap() {

  const RBMQ_USER = configService.get<string>('RBMQ_USER')
  const RBMQ_PASSWORD = configService.get<string>('RBMQ_PASSWORD')
  const RBMQ_URL = configService.get<string>('RBMQ_URL')

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${RBMQ_USER}:${RBMQ_PASSWORD}@${RBMQ_URL}`],
      noAck: false,
      queue: 'challenges'
    },
  });

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz("America/Sao_Paulo")
      .format("YYYY-MM-DD HH:mm:ss.SSS")
  }

  await app.listen().then(() => logger.log('Challenges - Microservice is listening'));

}
bootstrap();
