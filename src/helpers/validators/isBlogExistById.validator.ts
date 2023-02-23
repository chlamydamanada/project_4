import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsQweryRepository } from '../../modules/blogs/api/qweryRepositories/blogsQwery.repository';

@ValidatorConstraint({ name: 'IsBlogExist', async: true })
@Injectable()
export class IsBlogExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogsQweryRepository: BlogsQweryRepository) {}

  async validate(id: string) {
    console.log('id:', id);
    const blog = await this.blogsQweryRepository.getBlogByBlogId(id);
    console.log('blog:', blog);
    if (blog) return true;
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return "Blog doesn't exist";
  }
}
