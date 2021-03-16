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
const currentTeamsButtons = [
  { value: 'Data', color: '#EF8B8B' },
  { value: 'Editing', color: '#A5C4F2' },
  { value: 'Fact-checking', color: '#CFE7C4' },
  { value: 'Illustration', color: '#BAB9E9' },
  { value: 'Layout', color: '#F9B893' },
  { value: 'Photography', color: '#D8ACE8' },
  { value: 'Radio', color: '#F1D8B0' },
  { value: 'Visuals', color: '#BFEBE0' },
  { value: 'Writing', color: '#A9D3E5' },
];

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

export { interestsButtons, currentTeamsButtons, enumToInterestButtons };
