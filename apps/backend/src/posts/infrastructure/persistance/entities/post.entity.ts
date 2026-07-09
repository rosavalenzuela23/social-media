import { BeforeInsert, Column, Entity, Index, ObjectId, ObjectIdColumn, OneToMany } from "typeorm";
import ImageEntity from "./image.entity.js";
import CommentEntity from "./comment.entity.js";
import LikeEntity from "./like.entity.js";

@Entity("posts")
export default class PostEntity {
	@ObjectIdColumn()
	_id: ObjectId;

	@Column({ type: "varchar" })
	@Index("idx_post_uuid_unique", { unique: true, sparse: true })
	uuid: string;

	@Column({ type: "varchar" })
	creatorUuid: string;

	@Column({ type: "varchar" })
	creatorUsername: string;

	@Column({ type: "varchar" })
	message: string;

	@Column({ type: "date" })
	createdAt: Date;

	@Column({ type: "array" })
	userUuidExcludeList: string[];

	@Column(() => ImageEntity)
	postImages: ImageEntity[] = [];

	@Column(() => CommentEntity)
	comments: CommentEntity[];

	@Column(() => LikeEntity)
	likes: LikeEntity[];

	@BeforeInsert()
	beforeInsert() {
		if (!this.uuid) {
			this.uuid = crypto.randomUUID();
		}
	}
}
