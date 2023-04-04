import { ChallengeStatus } from "./challenge-status.enum"

export interface Challenge {
  readonly _id: string
  status: ChallengeStatus
  requester: string
  challengeDate: Date
  requestDate: Date
  responseDate: Date
  category: string
  players: Array<string>
  match?: string
}