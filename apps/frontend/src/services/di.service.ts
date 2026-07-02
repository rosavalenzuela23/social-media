import { Container } from "inversify";
import AuthService from "./auth.service";
import PostService from "./posts.service";
import ProfileService from "./profile.service";

const container = new Container();
container.bind(AuthService).toSelf();
container.bind(PostService).toSelf();
container.bind(ProfileService).toSelf();

export default container;
