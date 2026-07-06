import type { IProfileRepository } from "@/profiles/application/ports/profile.repository.js";
import ProfileEntity from "@/profiles/infraestructure/persistance/entities/profile.entity.js";
import ProfileMapper from "@/profiles/infraestructure/persistance/mappers/profile.mapper.js";
import { appDataSource as datasorce } from "@/profiles/infraestructure/persistance/postgres-connection.js";
import Profile from "@profiles/domain/user.js";
import { injectable } from "tsyringe";
import { EntityManager, Repository } from "typeorm";

@injectable()
export default class PostgresRepository implements IProfileRepository {
	private dbContainer = datasorce;
	private profileRepository: Repository<ProfileEntity>;

	constructor(manager?: EntityManager) {
		this.profileRepository = (manager || this.dbContainer).getRepository(ProfileEntity);
	}

	async getAllUsers(): Promise<Profile[]> {
		const usersEntity = await this.dbContainer.getRepository(ProfileEntity).find();
		if (!usersEntity) {
			return [];
		}
		return usersEntity.map((userEntity) => ProfileMapper.toDomain(userEntity));
	}

	async createProfile(uuid: string, username: string, name: string): Promise<Profile> {
		const profile = await this.getUserByUsername(username);

		if (profile) {
			throw new Error("profile already exists");
		}

		const profileEntity = new ProfileEntity();

		profileEntity.uuid = uuid;
		profileEntity.name = name;
		profileEntity.username = username;

		const saveProfile = await this.profileRepository.save(profileEntity);

		return ProfileMapper.toDomain(saveProfile);
	}

	async updateUser(user: Profile): Promise<void> {
		await this.profileRepository.update(
			{
				username: user.username,
			},
			user,
		);
	}

	async getUserByUsername(username: string): Promise<Profile | null> {
		const userEntity = await this.profileRepository.findOne({
			where: {
				username,
			},
		});

		if (!userEntity) {
			return null;
		}

		return ProfileMapper.toDomain(userEntity);
	}

	async addFriend(user: Profile, userFriend: Profile): Promise<void> {
		const userEntity = ProfileMapper.toEntity(user);
		const userEntityFriend = ProfileMapper.toEntity(userFriend);

		await this.dbContainer.transaction(async (manager: EntityManager) => {
			await manager.getRepository(ProfileEntity).update(
				{
					username: userEntity.username,
				},
				userEntity,
			);

			await manager.getRepository(ProfileEntity).update(
				{
					username: userEntityFriend.username,
				},
				userEntityFriend,
			);
		});
	}

	async getUserByUuid(uuid: string): Promise<Profile | null> {
		const profile = await this.dbContainer.getRepository(ProfileEntity).findOne({
			where: {
				uuid,
			},
		});

		if (!profile) {
			return null;
		}

		return ProfileMapper.toDomain(profile);
	}
}
