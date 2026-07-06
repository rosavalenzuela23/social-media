import type Comment from "@/posts/domain/comment.js";
import { BeforeInsert, Column, Entity, ObjectId, PrimaryGeneratedColumn } from "typeorm";
import LikeEntity from "./like.entity.js";

@Entity()
export default class CommentEntity implements Comment {
	@PrimaryGeneratedColumn()
	_id: ObjectId;

	@Column({
		type: "string",
	})
	creatorUsername: string;

	@Column({
		type: "string",
	})
	creatorUuid: string;

	@Column({
		type: "date",
	})
	date: Date;

	@Column({
		type: "string",
	})
	message: string;

	@Column({
		type: "string",
	})
	uuid: string;

	@Column({
		type: "string",
	})
	postUuid: string;

	@Column(() => LikeEntity)
	likes: LikeEntity[];

	@BeforeInsert()
	beforeInsert() {
		this.uuid = crypto.randomUUID();
		this.date = new Date();
	}
}
