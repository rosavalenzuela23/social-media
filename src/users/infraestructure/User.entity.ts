import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity("users")
export default class UserEntity {

    @ObjectIdColumn()
    public id: number;

    @Column({
        type: "varchar",
        generated: "uuid"
    })
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
        type: "varchar",
    })
    public uuid: string;

    @Column({
        type: "varchar",
    })
    public friendList: UserEntity[]
}