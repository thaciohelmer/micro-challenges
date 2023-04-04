import { Controller } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Challenge } from './interfaces/challenge.interface';


const ackErrors: string[] = ['E11000']


@Controller()
export class ChallengesController {

  constructor(private readonly challengeService: ChallengesService) { }

  @EventPattern("create-challenge")
  async createChallenge(@Payload() challenge: Challenge, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()

    try {
      await this.challengeService.create(challenge)
      await channel.ack(originalMsg)
    } catch (error) {
      const filterAckError = ackErrors.find(ackError => error.message.includes(ackError))
      if (filterAckError) await channel.ack(originalMsg)
    }
  }

  @MessagePattern('get-all-challenges')
  async getAllChallenges(
    @Ctx() context: RmqContext
  ): Promise<Array<Challenge> | Challenge> {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()

    try {
      return await this.challengeService.getAll();
    } finally {
      await channel.ack(originalMsg)
    }
  }

  @MessagePattern('get-by-player')
  async getChallengeByPlayer(
    @Payload() id: string,
    @Ctx() context: RmqContext
  ): Promise<Array<Challenge> | Challenge> {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      return await this.challengeService.getByPlayer(id);
    } finally {
      await channel.ack(originalMsg)
    }
  }

  @MessagePattern('get-by-id')
  async getChallengeById(
    @Payload() id: any,
    @Ctx() context: RmqContext
  ): Promise<Array<Challenge> | Challenge> {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()

    try {
      return await this.challengeService.getById(id);
    } finally {
      await channel.ack(originalMsg)
    }
  }

  @MessagePattern('get-all-accomplished-by-date')
  async getAllAccomplishedChallengesByDate(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ): Promise<Array<Challenge> | Challenge> {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      const { categoryId, date } = data
      return await this.challengeService.getAllAccomplishedByDate(categoryId, date);
    } finally {
      await channel.ack(originalMsg)
    }
  }

  @MessagePattern('get-all-accomplished')
  async getAllAccomplishedChallenges(
    @Payload() categoryId: any,
    @Ctx() context: RmqContext
  ): Promise<Array<Challenge> | Challenge> {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      return await this.challengeService.getAllAccomplished(categoryId);
    } finally {
      await channel.ack(originalMsg)
    }
  }

  @EventPattern('update-challenge')
  async updateChallenge(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      const { id, challenge } = data
      await this.challengeService.update(id, challenge)
      await channel.ack(originalMsg)
    } catch (error) {
      const filterAckError = ackErrors.find(ackError => error.message.includes(ackError))
      if (filterAckError) await channel.ack(originalMsg)
    }
  }

  @EventPattern('update-challenge-match')
  async updateChallengeMatch(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      const { id, challenge } = data
      await this.challengeService.updateChallengeMatch(id, challenge)
      await channel.ack(originalMsg)
    } catch (error) {
      const filterAckError = ackErrors.find(ackError => error.message.includes(ackError))
      if (filterAckError) await channel.ack(originalMsg)
    }
  }

  @EventPattern('delete-challenge')
  async deleteChallenge(@Payload() challenge: Challenge, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      await this.challengeService.delete(challenge)
      await channel.ack(originalMsg)
    } catch (error) {
      const filterAckError = ackErrors.find(ackError => error.message.includes(ackError))
      if (filterAckError) await channel.ack(originalMsg)
    }
  }
}












