import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsQweryRepository } from '../../modules/features/public/blogs/api/qweryRepositories/blogsQwery.repository';

@ValidatorConstraint({ name: 'IsBlogExist', async: true })
@Injectable()
export class IsBlogExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogsQweryRepository: BlogsQweryRepository) {}

  async validate(id: string) {
    const blog = await this.blogsQweryRepository.getBlogByBlogId(id);
    if (blog) return true;
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return "Blog doesn't exist";
  }
}
