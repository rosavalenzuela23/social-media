import type Comment from "@/posts/domain/comment.js";
import { BeforeInsert, Column, Entity, ObjectId, PrimaryGeneratedColumn } from "typeorm";
import LikeEntity from "./like.entity.js";

@Entity()
export default class CommentEntity implements Comment {
	@PrimaryGeneratedColumn()
	_id: ObjectId;

	@Column()
	creatorUsername: string;

	@Column()
	creatorUuid: string;

	@Column()
	date: Date;

	@Column()
	message: string;

	@Column()
	uuid: string;

	@Column()
	postUuid: string;

	@Column(() => LikeEntity)
	likes: LikeEntity[];

	@BeforeInsert()
	beforeInsert() {
		this.uuid = crypto.randomUUID();
		this.date = new Date();
	}
}
