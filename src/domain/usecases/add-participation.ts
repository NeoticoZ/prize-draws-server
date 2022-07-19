import { Participation } from "@/domain/models";

export interface AddParticipation {
  add(participation: Participation): Promise<void>;
}

export namespace AddParticipation {
  export type Params = Participation;
}
