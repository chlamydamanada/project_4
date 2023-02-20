import { Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsQweryRepository } from '../../api/repositoriesQwery/blogsQwery.repository';

@ValidatorConstraint({ name: 'IsBlogExist', async: true })
@Injectable()
export class IsBlogExistValidator implements ValidatorConstraintInterface {
  constructor(
    @Inject(BlogsQweryRepository)
    private blogQueryRepository: BlogsQweryRepository,
  ) {}

  async validate(id: string) {
    try {
      const blog = await this.blogQueryRepository.getBlogByBlogId(id);
      if (!blog) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return "Blog doesn't exist";
  }
}
