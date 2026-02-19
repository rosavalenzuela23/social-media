import { Column, Index, ObjectId, PrimaryGeneratedColumn } from 'typeorm';

export default class ImageEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: ObjectId;

  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'varchar' })
  @Index('idx_image_uuid_unique', { unique: true, sparse: true })
  uuid: string;
}
