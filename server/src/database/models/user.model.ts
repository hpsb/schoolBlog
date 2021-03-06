import { BaseModel } from './base.model';
import { Model } from 'objection';
import { PostModel } from './post.model';
import { CommentModel } from './comment.model';
import { ReplyModel } from './reply.model';

export class UserModel extends BaseModel {
  static tableName = 'users';

  name!: string;
  email!: string;
  level!: number;
  picture: string;

  count?: string;

  posts?: PostModel[];
  comments?: CommentModel[];
  replies?: ReplyModel[];

  static relationMappings = () => ({
    posts: {
      modelClass: PostModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'users.id',
        to: 'posts.userId',
      },
    },

    comments: {
      modelClass: CommentModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'users.id',
        to: 'comments.userId',
      },
    },

    replies: {
      modelClass: ReplyModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'users.id',
        to: 'replies.userId',
      },
    },
  });
}
