import Profile from "@users/domain/user.js";

export default interface IProfileRepository {
  getAllUsers(): Promise<Profile[]>;
  createUser(username: string, password: string): Promise<void>;
  getUserByUsername(username: string): Promise<Profile | null>;
  updateUser(user: Profile): Promise<void>;
  addFriend(user: Profile, userFriend: Profile): Promise<void>;
}
