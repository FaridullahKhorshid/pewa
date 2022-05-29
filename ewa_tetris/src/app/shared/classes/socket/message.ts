export class Message {
  public text!: string;
  public type: 'message' | 'typing' | 'welcome' = "message";
  public user!: { username: String };
}
