type Post = {
  creatorUuid: string;
  message: string;
  date: Date;
  userUuidExcludeList: Array<string>;
  images: Array<string>;
};

export type { Post };
