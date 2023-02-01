import { EmailConfirmationDTO } from './emailConfirmationDTO';

export class UserDTO {
  createdAt: string;
  emailConfirmation: EmailConfirmationDTO;
  constructor(
    public login: string,
    public email: string,
    public passwordHash: string,
  ) {
    this.createdAt = new Date().toISOString();
    this.emailConfirmation = new EmailConfirmationDTO();
  }
}
