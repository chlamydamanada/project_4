import { commentInputDtoType } from '../commentsTypes/commentInputDtoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../repositories/comments.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public commentInputDto: commentInputDtoType,
    public userId: string,
  ) {}
}
@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async execute(command: UpdateCommentCommand): Promise<void> {
    const comment = await this.commentsRepository.findCommentById(
      command.commentId,
    );
    if (!comment)
      throw new NotFoundException('Comment with this id does not exist');
    if (comment.userId !== command.userId)
      throw new ForbiddenException(
        'You try edit the comment that is not your own',
      );
    comment.updateComment(command.commentInputDto);
    await this.commentsRepository.saveComment(comment);
    return;
  }
}
