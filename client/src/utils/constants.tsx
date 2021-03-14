// All of the interests buttons to show
const interestsButtons = [
  { value: 'Cannabis', color: '#CFE7C4' },
  { value: 'Education', color: '#A9D3E5' },
  { value: 'Food and Land', color: '#BFEBE0' },
  { value: 'Fun', color: '#F9B893' },
  { value: 'Health', color: '#F9B893' },
  { value: 'Housing', color: '#EF8B8B' },
  { value: 'Immigration', color: '#D8ACE8' },
  { value: 'Literature', color: '#A5C4F2' },
  { value: 'Music', color: '#BFEBE0' },
  { value: 'Nature', color: '#CFE7C4' },
  { value: 'Politics', color: '#A5C4F2' },
  { value: 'Stage and Screen', color: '#D8ACE8' },
  { value: 'Transportation', color: '#F1D8B0' },
  { value: 'Visual Arts', color: '#BAB9E9' },
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

export { interestsButtons, enumToInterestButtons };
