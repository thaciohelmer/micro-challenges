import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from './interfaces/challenge.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { RpcException } from '@nestjs/microservices';
import momentTimezone from 'moment-timezone';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private clientAdmBackend: ClientProxySmartRanking
  ) { }


  async create(challenge: Challenge): Promise<Challenge> {
    try {
      const createdChallenge = new this.challengeModel(challenge)
      createdChallenge.challengeDate = new Date()
      createdChallenge.status = ChallengeStatus.PENDING
      await createdChallenge.save()

      return createdChallenge
    } catch (error) {
      throw new RpcException(error.message)
    }

  }

  async getAll(): Promise<Challenge[]> {
    try {
      return await this.challengeModel.find()
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  async getByPlayer(id: string): Promise<Array<Challenge> | Challenge> {
    try {
      return await this.challengeModel.find()
        .where('players')
        .equals(id)
    } catch (error) {
      throw new RpcException(error.message)
    }

  }

  async getById(_id: any): Promise<Challenge> {
    try {
      return await this.challengeModel.findOne({ _id });
    } catch (error) {
      throw new RpcException(error.message)
    }

  }

  async getAllAccomplished(categoryId: string): Promise<Array<Challenge>> {
    try {
      return await this.challengeModel.find()
        .where('categoria')
        .equals(categoryId)
        .where('status')
        .equals(ChallengeStatus.REALIZED)
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  async getAllAccomplishedByDate(categoryId: string, date: string): Promise<Challenge[]> {
    try {
      const newDate = `${date} 23:59:59.999`
      const momentDate = momentTimezone.tz(newDate, 'YYYY-MM-DD HH:mm:ss.SSS', 'UTC').valueOf()

      return await this.challengeModel.find()
        .where('category')
        .equals(categoryId)
        .where('status')
        .equals(ChallengeStatus.REALIZED)
        .where('challengeDate')
        .lte(momentDate)
    } catch (error) {
      throw new RpcException(error.message)
    }
  }


  async update(_id: string, challenge: Challenge): Promise<void> {
    try {
      challenge.responseDate = new Date()
      await this.challengeModel.findOneAndUpdate({ _id }, { $set: challenge })
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  async updateChallengeMatch(idPartida: string, challenge: Challenge): Promise<void> {
    try {
      challenge.status = ChallengeStatus.REALIZED
      challenge.match = idPartida
      await this.challengeModel.findOneAndUpdate({ _id: challenge._id }, { $set: challenge })
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  async delete(challenge: Challenge): Promise<void> {
    try {
      const { _id } = challenge
      challenge.status = ChallengeStatus.CANCELED
      await this.challengeModel.findOneAndUpdate({ _id }, { $set: challenge })
    } catch (error) {
      throw new RpcException(error.message)
    }
  }
}
