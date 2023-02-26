import { Controller, Delete, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllDataCommand } from '../../application/deleteAllData.useCase';

@Controller('testing/all-data')
export class AllTestingDataController {
  constructor(private commandBus: CommandBus) {}
  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<string | void> {
    return this.commandBus.execute(new DeleteAllDataCommand());
  }
}
