type Image = {
  path: string;
  uuid: string;
};

type Post = {
  creatorUsername: string;
  uuid: string;
  creatorUuid: string;
  message: string;
  date: string;
  images: Array<Image>;
};

export type { Post, Image };
