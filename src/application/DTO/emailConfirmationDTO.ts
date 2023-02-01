import add from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';
export class EmailConfirmationDTO {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
  constructor() {
    this.confirmationCode = uuidv4();
    this.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 30,
    });
    this.isConfirmed = false;
  }
}
