import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Match } from './interfaces/matchs.interface';
import { Model } from 'mongoose';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { Challenge } from 'src/challenges/interfaces/challenge.interface';
import { lastValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class MatchsService {

  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private clientAdmBackend: ClientProxySmartRanking
  ) { }

  private clientChallenges = this.clientAdmBackend.getChallenge()

  async create(match: Match): Promise<Match> {
    try {

      const createdMatch = new this.matchModel(match)
      const result = await createdMatch.save()
      const matchId = result._id
      const challenge: Challenge = await lastValueFrom(this.clientChallenges.send('get-by-id', matchId))

      await lastValueFrom(this.clientChallenges.emit('update-challenge-match', { matchId, challenge }))

      return result
    } catch (error) {
      throw new RpcException(error.message)
    }
  }
}
