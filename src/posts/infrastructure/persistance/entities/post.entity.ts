import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";


@Entity("posts")
export default class PostEntity {

    @ObjectIdColumn()
    id: ObjectId;

    @Column({ type: "varchar" })
    creatorUuid: string;

    @Column({ type: "varchar" })
    message: string;

    @Column({ type: "date" })
    createdAt: Date;

    @Column({ type: "array" })
    postImages: string[]

    @Column({ type: "array" })
    comments: PostEntity[];

}