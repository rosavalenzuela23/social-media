import PostDTO from "../domain/postdto"


export default class BusinessLogic {

    constructor(
        private postRepository: IPostRepository
    ) {

    }

    getUserPosts(userId: number) {

    }

    async createPost(userUuid: string, message: string) {
        //Obtener toda la informacion del usuario



    }

}