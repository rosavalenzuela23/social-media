import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn,
  OneToMany,
} from 'typeorm';
import { v4 } from 'uuid';
import ImageEntity from './image.entity.js';

@Entity('posts')
export default class PostEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ type: 'varchar' })
  @Index('idx_post_uuid_unique', { unique: true, sparse: true })
  uuid: string;

  @Column({ type: 'varchar' })
  creatorUuid: string;

  @Column({ type: 'varchar' })
  creatorUsername: string;

  @Column({ type: 'varchar' })
  message: string;

  @Column({ type: 'date' })
  createdAt: Date;

  @Column({ type: 'array' })
  userUuidExcludeList: string[];

  @Column(() => ImageEntity)
  postImages: ImageEntity[] = [];

  @OneToMany(() => PostEntity, (post) => post.comments)
  comments: PostEntity[];

  @BeforeInsert()
  beforeInsert() {
    this.uuid = v4().toString();
  }
}
