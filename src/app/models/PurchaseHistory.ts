/**
 * Entity represent the history invested and earned by user
 */
import {GroupGame} from "./GroupGame";

export class PurchaseHistory {
  public _id: string;
  public userId: string;
  public action: string;
  public groupId: string;
  public quantity: string[];
  public payReference: string;
  public groupInfo: GroupGame;
  public moneyDirection: boolean;
  public createdAt: string;
  public updateAt: string;
  public invested?: number;
  public earned: number;

  public constructor(){}
}
