import { Column, Index, ObjectId, ObjectIdColumn } from "typeorm";

export default class ImageEntity {

    @ObjectIdColumn()
    id: ObjectId;

    @Column({ type: "varchar" })
    path: string;

    @Column({ type: "varchar" })
    @Index({ unique: true, sparse: true })
    uuid: string;

} 