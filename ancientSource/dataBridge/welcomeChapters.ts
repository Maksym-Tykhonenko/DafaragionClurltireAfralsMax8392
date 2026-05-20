export type WelcomeChapter = {
  title: string;
  body: string;
  image: number;
};

export const welcomeChapters: WelcomeChapter[] = [
  {
    title: 'Explore Ancient Symbols',
    body: 'Discover cultural landmarks, legendary places, and historic stories inspired by mythical creatures around the world.',
    image: require('../../aroimgonige/argrodnsorbns/bg1.png'),
  },
  {
    title: 'Open the World Atlas',
    body: 'Browse marked locations on a map, filter by category, and open detailed cultural notes for each place.',
    image: require('../../aroimgonige/argrodnsorbns/bg2.png'),
  },
  {
    title: 'Read the Lore',
    body: 'Explore stories, traditions, timelines, and symbolic meanings from different cultures and historic regions.',
    image: require('../../aroimgonige/argrodnsorbns/bg3.png'),
  },
  {
    title: 'Test Your Knowledge',
    body: 'Complete short quizzes and word challenges to review what you have learned.',
    image: require('../../aroimgonige/argrodnsorbns/bg4.png'),
  },
];

export const welcomeFinalImage = require('../../aroimgonige/argrodnsorbns/bg5.png');
