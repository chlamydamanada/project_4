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
  constructor(private readonly blogsQweryRepository: BlogsQweryRepository) {}

  async validate(id: string) {
    try {
      console.log('id:', id);
      const blog = await this.blogsQweryRepository.getBlogByBlogId(id);
      console.log('blog:', blog);
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
