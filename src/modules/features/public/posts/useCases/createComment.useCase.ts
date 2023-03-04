import { commentInputDtoType } from '../../comments/commentsTypes/commentInputDtoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../comments/repositories/comments.repository';
import { PostsRepository } from '../../../blogger/posts/repositories/posts.repository';
import { UsersRepository } from '../../../superAdmin/users/repositories/users.repository';
import { NotFoundException } from '@nestjs/common';

export class CreateCommentCommand {
  constructor(
    public postId: string,
    public commentDto: commentInputDtoType,
    public userId: string,
  ) {}
}
@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: CreateCommentCommand): Promise<string> {
    //first step: find post by id and check does it exist
    const post = await this.postsRepository.findPostById(command.postId);
    if (!post) throw new NotFoundException('Post with this id does not exist');

    // second step: find user by id
    const user = await this.usersRepository.findUserById(command.userId);

    //third step: create new comment
    const newComment = this.commentsRepository.getCommentEntity();
    newComment.createComment(
      command.commentDto,
      command.postId,
      command.userId,
      user!.login,
    );

    //fourth step: save this comment and return comment ID
    const commentId = await this.commentsRepository.saveComment(newComment);
    return commentId;
  }
}