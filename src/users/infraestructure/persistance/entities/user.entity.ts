import { BeforeInsert, Column, Entity, Generated, ObjectId, ObjectIdColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("users")
export default class UserEntity {

    @ObjectIdColumn()
    public id: ObjectId;

    @Column({ type: "varchar" })
    @Generated("uuid")
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
        type: "varchar",
    })
    public password: string;

    @Column({
        type: "array",
    })
    public uuidFriendList: string[]

    @BeforeInsert()
    public beforeInsert() {
        this.uuid = uuidv4();
    }

}