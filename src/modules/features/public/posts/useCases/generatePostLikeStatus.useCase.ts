import { PostsRepository } from '../../../blogger/posts/repositories/posts.repository';
import { UserInfoType } from '../../auth/types/userInfoType';
import { StatusPipe } from '../../status/api/pipes/statusPipe';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

export class GeneratePostLikeStatusCommand {
  constructor(
    public postId: string,
    public userInfo: UserInfoType,
    public statusDto: StatusPipe,
  ) {}
}

@CommandHandler(GeneratePostLikeStatusCommand)
export class GeneratePostLikeStatusUseCase
  implements ICommandHandler<GeneratePostLikeStatusCommand>
{
  constructor(private readonly postsRepository: PostsRepository) {}
  async execute(command: GeneratePostLikeStatusCommand): Promise<void> {
    //first step: find post by id and check does it exist
    const post = await this.postsRepository.findPostById(command.postId);
    if (!post) throw new NotFoundException('Post with this id does not exist');

    //third step: find status for this post by postId, userId and name of entity - post
    const statusOfPost = await this.postsRepository.findStatusOfPost(
      'post',
      command.postId,
      command.userInfo.id,
    );

    //if status not found, should create it
    if (!statusOfPost) {
      const newStatus = this.postsRepository.getStatusEntity();
      newStatus.createStatus({
        entity: 'post',
        entityId: command.postId,
        userId: command.userInfo.id,
        userLogin: command.userInfo.login,
        status: command.statusDto.likeStatus,
      });
      await this.postsRepository.saveStatus(newStatus);
      return;
    }

    //if status found, should update it
    statusOfPost.updateStatus(command.statusDto.likeStatus);
    await this.postsRepository.saveStatus(statusOfPost);
    return;
  }
}
