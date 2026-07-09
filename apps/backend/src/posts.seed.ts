// seed-data/posts.seed.ts

export type SeedPost = {
  username: string;
  message: string;
  createdAtOffsetMinutes: number;
  tags?: string[];
};

export const seedPosts: SeedPost[] = [
  // =========================================================
  // 5 TOPIC-SPECIFIC CLUSTERS
  // =========================================================

  // 1. Gaming
  {
    username: 'johndoe',
    message: 'Finally beat that boss after 3 hours. Gaming is pain and joy at the same time.',
    createdAtOffsetMinutes: 300,
    tags: ['gaming'],
  },
  {
    username: 'alicej',
    message: 'This new RPG combat system is actually insane. Way deeper than I expected.',
    createdAtOffsetMinutes: 250,
    tags: ['gaming'],
  },
  {
    username: 'bobb',
    message: 'Anyone else grinding ranked tonight or just me?',
    createdAtOffsetMinutes: 200,
    tags: ['gaming'],
  },
  {
    username: 'janesmith',
    message: 'Controller drift is slowly ruining my life.',
    createdAtOffsetMinutes: 180,
    tags: ['gaming'],
  },
  {
    username: 'charlieg',
    message: 'Speedrunning old games hits different when you know every frame.',
    createdAtOffsetMinutes: 150,
    tags: ['gaming'],
  },

  // 2. Programming
  {
    username: 'alicej',
    message: 'TypeScript generics finally clicked today. That feels like unlocking a new brain layer.',
    createdAtOffsetMinutes: 300,
    tags: ['programming'],
  },
  {
    username: 'johndoe',
    message: 'Refactoring legacy code without tests should be classified as extreme sports.',
    createdAtOffsetMinutes: 270,
    tags: ['programming'],
  },
  {
    username: 'janesmith',
    message: 'Why does one missing semicolon always break production at the worst time?',
    createdAtOffsetMinutes: 240,
    tags: ['programming'],
  },
  {
    username: 'bobb',
    message: 'Clean architecture makes sense until you actually try implementing it.',
    createdAtOffsetMinutes: 210,
    tags: ['programming'],
  },
  {
    username: 'charlieg',
    message: 'I think I finally understand dependency injection… I think.',
    createdAtOffsetMinutes: 180,
    tags: ['programming'],
  },

  // 3. Anime
  {
    username: 'janesmith',
    message: 'That episode destroyed me emotionally. Studio really didn’t hold back.',
    createdAtOffsetMinutes: 300,
    tags: ['anime'],
  },
  {
    username: 'alicej',
    message: 'Rewatching old anime hits differently when you’re older.',
    createdAtOffsetMinutes: 280,
    tags: ['anime'],
  },
  {
    username: 'johndoe',
    message: 'The animation quality this season is absurdly good.',
    createdAtOffsetMinutes: 260,
    tags: ['anime'],
  },
  {
    username: 'bobb',
    message: 'Filler episodes are either comfort or punishment, no in-between.',
    createdAtOffsetMinutes: 240,
    tags: ['anime'],
  },
  {
    username: 'charlieg',
    message: 'I need more anime with grounded storytelling and no power scaling nonsense.',
    createdAtOffsetMinutes: 220,
    tags: ['anime'],
  },

  // 4. Music
  {
    username: 'johndoe',
    message: 'This new album feels like driving alone at night with the windows down.',
    createdAtOffsetMinutes: 300,
    tags: ['music'],
  },
  {
    username: 'alicej',
    message: 'I can’t stop replaying that guitar riff. It’s dangerously addictive.',
    createdAtOffsetMinutes: 280,
    tags: ['music'],
  },
  {
    username: 'janesmith',
    message: 'Lyrics that feel like they were written directly for you are scary sometimes.',
    createdAtOffsetMinutes: 260,
    tags: ['music'],
  },
  {
    username: 'bobb',
    message: 'Concert audio recordings never hit the same as being there.',
    createdAtOffsetMinutes: 240,
    tags: ['music'],
  },
  {
    username: 'charlieg',
    message: 'I think I understand Midwest emo now. It’s just emotional damage in 4/4 time.',
    createdAtOffsetMinutes: 220,
    tags: ['music'],
  },

  // 5. Life / Casual reflection
  {
    username: 'johndoe',
    message: 'Some days feel like nothing changes but everything is different.',
    createdAtOffsetMinutes: 300,
    tags: ['life'],
  },
  {
    username: 'alicej',
    message: 'I forgot how good sunlight feels after staying inside too long.',
    createdAtOffsetMinutes: 280,
    tags: ['life'],
  },
  {
    username: 'janesmith',
    message: 'Trying to organize my thoughts but they keep buffering.',
    createdAtOffsetMinutes: 260,
    tags: ['life'],
  },
  {
    username: 'bobb',
    message: 'Coffee tastes better when you actually sit down instead of rushing.',
    createdAtOffsetMinutes: 240,
    tags: ['life'],
  },
  {
    username: 'charlieg',
    message: 'I think I’m slowly learning that consistency matters more than intensity.',
    createdAtOffsetMinutes: 220,
    tags: ['life'],
  },

  // =========================================================
  // 5 CROSS-TOPIC POSTS
  // =========================================================

  {
    username: 'johndoe',
    message: 'Coding while listening to anime soundtracks is peak productivity.',
    createdAtOffsetMinutes: 200,
    tags: ['programming', 'anime', 'music'],
  },
  {
    username: 'alicej',
    message: 'Gaming storylines are starting to feel like better-written anime arcs.',
    createdAtOffsetMinutes: 180,
    tags: ['gaming', 'anime'],
  },
  {
    username: 'janesmith',
    message: 'Debugging at 2AM feels like a horror game with no save points.',
    createdAtOffsetMinutes: 160,
    tags: ['programming', 'gaming'],
  },
  {
    username: 'bobb',
    message: 'Listening to lo-fi while grinding ranked is my version of meditation.',
    createdAtOffsetMinutes: 140,
    tags: ['gaming', 'music'],
  },
  {
    username: 'charlieg',
    message: 'Anime OSTs make even writing backend APIs feel dramatic.',
    createdAtOffsetMinutes: 120,
    tags: ['programming', 'music', 'anime'],
  },
];
