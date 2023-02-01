export class LikeStatusDTO {
  addedAt: string;
  constructor(
    public entity: string,
    public entityId: string,
    public userId: string,
    public userLogin: string,
    public status: string,
  ) {
    this.addedAt = new Date().toISOString();
  }
}
