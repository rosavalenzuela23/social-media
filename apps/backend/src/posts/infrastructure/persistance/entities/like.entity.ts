import type Like from "@/posts/domain/like.js";
import { Column, Entity } from "typeorm";

@Entity()
export default class LikeEntity implements Like {
	@Column()
	userUuid: string;

	@Column()
	username: string;

	@Column()
	postId: string;

	@Column()
	createdAt: Date;
}
