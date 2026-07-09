import { Column, Entity, ObjectId, PrimaryGeneratedColumn } from "typeorm";
import { LikeTextEnum } from "../../../domain/like.enum.js";

@Entity("profiles")
export default class ProfileEntity {
	@PrimaryGeneratedColumn({ type: "bigint" })
	public id: ObjectId;

	@Column({ type: "varchar" })
	public uuid: string;

	@Column({
		type: "varchar",
	})
	public name: string;

	@Column({
		type: "varchar",
		length: "255",
		nullable: true,
	})
	public bio?: string;

	@Column({
		type: "varchar",
	})
	public username: string;

	@Column({
		type: "json",
	})
	public uuidFriendList: string[] = [];

	@Column({
		type: "json",
	})
	public uuidBlockList: string[] = [];

	@Column({
		type: "enum",
		enum: LikeTextEnum,
		default: LikeTextEnum.MEOW,
		enumName: "profiles_liketext_enum",
	})
	public likeText: LikeTextEnum;

	@Column({
		type: "varchar",
		nullable: true,
	})
	public profilePictureName?: string;
}
