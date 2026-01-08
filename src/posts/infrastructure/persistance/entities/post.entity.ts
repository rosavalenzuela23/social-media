import { Column, Entity, ObjectId, ObjectIdColumn, OneToMany } from "typeorm";
import ImageEntity from "./image.entity.js";

@Entity("posts")
export default class PostEntity {

    @ObjectIdColumn()
    id: ObjectId;

    @Column({ type: "varchar" })
    creatorUuid: string;

    @Column({ type: "varchar" })
    creatorUsername: string;

    @Column({ type: "varchar" })
    message: string;

    @Column({ type: "date" })
    createdAt: Date;

    @Column(type => ImageEntity)
    postImages: ImageEntity[] = [];

    @OneToMany(() => PostEntity, post => post.comments)
    comments: PostEntity[];

} 