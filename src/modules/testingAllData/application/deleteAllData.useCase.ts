import { DeleteAllDataRepository } from '../repositories/deleteAllData.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteAllDataCommand {}

@CommandHandler(DeleteAllDataCommand)
export class DeleteAllDataUseCase
  implements ICommandHandler<DeleteAllDataCommand>
{
  constructor(
    private readonly deleteAllDataRepository: DeleteAllDataRepository,
  ) {}
  async execute(command: DeleteAllDataCommand): Promise<void> {
    return this.deleteAllDataRepository.deleteAllData();
  }
}
