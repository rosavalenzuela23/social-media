import ImageEntity from "../entities/image.entity.js";
import Image from '@posts/domain/image.js';

export default class ImageMapper {
    static toEntity(image: Image): ImageEntity {
        const imageEntity = new ImageEntity();
        imageEntity.path = image.path;
        imageEntity.uuid = image.uuid;
        return imageEntity;
    }

    static toDomain(imageEntity: ImageEntity): Image {
        return new Image(
            imageEntity.path,
            imageEntity.uuid
        );
    }

} 