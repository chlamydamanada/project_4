import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from '../repositories/comments.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { commentInputDtoType } from '../commentsTypes/commentInputDtoType';
import { StatusPipe } from '../../status/api/pipes/statusPipe';
import { UsersRepository } from '../../users/repositories/users.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createCommentByPostId(
    postId: string,
    dto: commentInputDtoType,
    userId: string,
  ): Promise<string> {
    //first step: find post by id and check does it exist
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post with this id does not exist');

    // second step: find user by id
    const user = await this.usersRepository.findUserById(userId);

    //third step: create new comment
    const newComment = this.commentsRepository.getCommentEntity();
    newComment.createComment(dto, postId, userId, user!.login);

    //fourth step: save this comment and return comment ID
    const commentId = await this.commentsRepository.saveComment(newComment);
    return commentId;
  }

  async updateCommentById(
    commentId: string,
    commentInputDto: commentInputDtoType,
    userId: string,
  ): Promise<void> {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment)
      throw new NotFoundException('Comment with this id does not exist');
    if (comment.userId !== userId)
      throw new ForbiddenException(
        'You try edit the comment that is not your own',
      );
    comment.updateComment(commentInputDto);
    await this.commentsRepository.saveComment(comment);
    return;
  }

  async deleteCommentById(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment)
      throw new NotFoundException('Comment with this id does not exist');
    if (comment.userId !== userId)
      throw new ForbiddenException(
        'You try delete the comment that is not your own',
      );
    await this.commentsRepository.deleteCommentById(commentId);
    return;
  }

  async generateCommentStatusById(
    commentId: string,
    userId: string,
    statusDto: StatusPipe,
  ): Promise<void> {
    //first step: find comment by id and check does it exist
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment)
      throw new NotFoundException('Comment with this id does not exist');

    //second step: find user by id from token
    const user = await this.usersRepository.findUserById(userId);

    //third step: find status for this comment by commentId, userId and name of entity
    const statusOfComment = await this.commentsRepository.findStatusOfComment(
      'comment',
      commentId,
      userId,
    );

    //if status not found, should create it
    if (!statusOfComment) {
      const newStatus = this.commentsRepository.getStatusEntity();
      newStatus.createStatus({
        entity: 'comment',
        entityId: commentId,
        userId,
        userLogin: user!.login,
        status: statusDto.likeStatus,
      });
      await this.commentsRepository.saveStatus(newStatus);
      return;
    }

    //if status found, should update it
    statusOfComment.updateStatus(statusDto.likeStatus);
    await this.commentsRepository.saveStatus(statusOfComment);
    return;
  }
}
