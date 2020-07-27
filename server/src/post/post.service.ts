import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import * as sanitizeHtml from 'sanitize-html';
import sanitizeHtmlOptions from '../common/util/sanitizeHtmlOptions';
import { PostModel } from '../database/models/post.model';
import { PostGetOptionsDto } from './dto/postGetOptions.dto';
import { PostCreateDto } from './dto/postCreate.dto';
import { POST_GET_OPTIONS, ATTACH_LIKES } from '../database/modifiers';
import { PostLikeModel } from 'src/database/models/postLike.model';

@Injectable()
export class PostService {
  constructor(
    @Inject('PostModel') private postModel: ModelClass<PostModel>,
    @Inject('PostLikeModel') private postLikeModel: ModelClass<PostLikeModel>
  ) {}

  async getById(id: number, userId?: number): Promise<PostModel> {
    const query = this.postModel
      .query()
      .findById(id)
      .withGraphFetched('[user, category, files]');
    
    if (userId) query.modify(ATTACH_LIKES, userId);

    return await query;
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

  async like(postId: number, userId: number) {
    return await this.postLikeModel
      .query()
      .insert({
        postId,
        userId
      });
  }

  async unlike(postId: number, userId: number) {
    return await this.postLikeModel
      .query()
      .where({
        postId,
        userId
      })
      .del();
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
