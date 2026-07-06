import type Like from "@/posts/domain/like.js";
import { Column, Entity, ObjectId, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class LikeEntity implements Like {
	@PrimaryGeneratedColumn()
	_id: ObjectId;

	@Column({
		type: "string",
	})
	userUuid: string;

	@Column({
		type: "string",
	})
	username: string;

	@Column({
		type: "string",
	})
	postId: string;

	@Column({
		type: "date",
	})
	createdAt: Date;
}
