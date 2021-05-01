import { interestsEnum } from './enums';
// All of the interests buttons to show
const interestsButtons: { [key: string]: string } = {
  Cannabis: '#CFE7C4',
  Education: '#A9D3E5',
  'Food and Land': '#BFEBE0',
  Fun: '#F9B893',
  Health: '#F9B893',
  Housing: '#EF8B8B',
  Immigration: '#D8ACE8',
  Literature: '#A5C4F2',
  Music: '#BFEBE0',
  Nature: '#CFE7C4',
  Politics: '#A5C4F2',
  'Stage and Screen': '#D8ACE8',
  Transportation: '#F1D8B0',
  'Visual Arts': '#BAB9E9',
};

// All of the buttons to show for the current teams
const currentTeamsButtons: { [key: string]: string } = {
  // Data: '#EF8B8B',
  Editing: '#A5C4F2',
  'Fact-checking': '#CFE7C4',
  Illustration: '#BAB9E9',
  // Layout: '#F9B893',
  Photography: '#D8ACE8',
  // Radio: '#F1D8B0',
  Visuals: '#BFEBE0',
  Writing: '#A9D3E5',
};

const teamToTeamsButtons: { [key: string]: string } = {
  writers: 'Writing',
  editors: 'Editing',
  visuals: 'Visuals',
  illustration: 'Illustration',
  photography: 'Photography',
  factChecking: 'Fact-checking',
};

const enumToInterestButtons: { [key: string]: string } = {
  CANNABIS: 'Cannabis',
  EDUCATION: 'Education',
  'FOOD AND LAND': 'Food and Land',
  FUN: 'Fun',
  HEALTH: 'Health',
  HOUSING: 'Housing',
  IMMIGRATION: 'Immigration',
  LITERATURE: 'Literature',
  MUSIC: 'Music',
  NATURE: 'Nature',
  POLITICS: 'Politics',
  'STAGE AND SCREEN': 'Stage and Screen',
  TRANSPORTATION: 'Transportation',
  'VISUAL ARTS': 'Visual Arts',
};

const interestsButtonsMap = [
  { display: 'Cannabis', value: interestsEnum.CANNABIS, color: '#CFE7C4' },
  { display: 'Education', value: interestsEnum.EDUCATION, color: '#A9D3E5' },
  {
    display: 'Food and Land',
    value: interestsEnum.FOOD_AND_LAND,
    color: '#BFEBE0',
  },
  { display: 'Fun', value: interestsEnum.FUN, color: '#F9B893' },
  { display: 'Health', value: interestsEnum.HEALTH, color: '#F9B893' },
  { display: 'Housing', value: interestsEnum.HOUSING, color: '#EF8B8B' },
  {
    display: 'Immigration',
    value: interestsEnum.IMMIGRATION,
    color: '#D8ACE8',
  },
  { display: 'Literature', value: interestsEnum.LIT, color: '#A5C4F2' },
  { display: 'Music', value: interestsEnum.MUSIC, color: '#BFEBE0' },
  { display: 'Nature', value: interestsEnum.NATURE, color: '#CFE7C4' },
  { display: 'Politics', value: interestsEnum.POLITICS, color: '#A5C4F2' },
  {
    display: 'Stage and Screen',
    value: interestsEnum.STAGE_AND_SCREEN,
    color: '#D8ACE8',
  },
  {
    display: 'Transportation',
    value: interestsEnum.TRANSPORTATION,
    color: '#F1D8B0',
  },
  {
    display: 'Visual Arts',
    value: interestsEnum.VISUAL_ARTS,
    color: '#BAB9E9',
  },
];

export {
  interestsButtons,
  currentTeamsButtons,
  enumToInterestButtons,
  teamToTeamsButtons,
  interestsButtonsMap,
};
