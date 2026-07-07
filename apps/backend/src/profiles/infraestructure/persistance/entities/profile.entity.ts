import { Column, Entity, ObjectId, PrimaryGeneratedColumn } from "typeorm";

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
		type: "varchar",
		nullable: true,
	})
	public profilePictureName?: string;
}
