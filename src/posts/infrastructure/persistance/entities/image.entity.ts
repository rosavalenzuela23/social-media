import { Column, ObjectId, ObjectIdColumn } from "typeorm";

export default class ImageEntity {

    @ObjectIdColumn()
    id: ObjectId;

    @Column({ type: "varchar" })
    path: string;

    @Column({ type: "varchar", unique: true })
    uuid: string;

} 