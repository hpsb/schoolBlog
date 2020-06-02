import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import * as sanitizeHtml from 'sanitize-html';
import sanitizeHtmlOptions from '../common/util/sanitizeHtmlOptions';
import { PostModel } from '../database/models/post.model';
import { PostGetOptionsDto } from './dto/postGetOptions.dto';
import { PostCreateDto } from './dto/postCreate.dto';
import { POST_GET_OPTIONS } from '../database/modifiers';

@Injectable()
export class PostService {
  constructor(@Inject('PostModel') private postModel: ModelClass<PostModel>) {}

  async getById(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .findById(id)
      .withGraphFetched('[user, category, files]');
  }

  async getAll(options?: PostGetOptionsDto): Promise<PostModel[]> {
    const query = this.postModel.query();
    // apply options if any
    if (options) {
      query.modify(POST_GET_OPTIONS, options);
    }
    // add user
    query.withGraphFetched('[user, category, files]');
    return await query;
  }

  sanitizeBody(body: string): string {
    return sanitizeHtml(body, sanitizeHtmlOptions);
  }

  async create(data: PostCreateDto): Promise<PostModel> {
    return await this.postModel
      .query()
      .insert(data)
      .returning('*')
      .first()
      .withGraphFetched('[user, category]');
  }

  async update(id: number, data: PostCreateDto): Promise<PostModel> {
    return await this.postModel
      .query()
      .where({ id })
      .update(data)
      .returning('*')
      .first()
      .withGraphFetched('[user, category]');
  }

  async publish(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .patchAndFetchById(id, { published: true })
      .withGraphFetched('[user, category]');
  }

  async unpublish(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .patchAndFetchById(id, { published: false })
      .withGraphFetched('[user, category]');
  }

  async verify(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .patchAndFetchById(id, { verified: true })
      .withGraphFetched('[user, category]');
  }

  async unverify(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .patchAndFetchById(id, { verified: false })
      .withGraphFetched('[user, category]');
  }

  async del(id: number): Promise<PostModel> {
    return await this.postModel
      .query()
      .where({ id })
      .del()
      .returning('*')
      .first();
  }
}
