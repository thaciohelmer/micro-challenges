import { Controller } from '@nestjs/common';
import { MatchsService } from './matchs.service';
import { Match } from './interfaces/matchs.interface';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

const ackErrors: string[] = ['E11000']

@Controller()
export class MatchsController {
  constructor(private readonly matchsService: MatchsService) { }

  @EventPattern('create-match')
  async createMatch(
    @Payload() match: Match,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()

    try {
      await this.matchsService.create(match)
      await channel.ack(originalMsg)
    } catch (error) {
      const filterAckError = ackErrors.find(ackError => error.message.includes(ackError))
      if (filterAckError) await channel.ack(originalMsg)
    }
  }

}
