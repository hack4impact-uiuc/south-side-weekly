import { onboardingStatusEnum, racesEnum, rolesEnum } from '../../utils/enums';

const EXAMPLE_MONGO_ID = '61bc193cc8ab66161a9d1a82';

export const userSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'User MongoDB auto-generated ID',
      example: EXAMPLE_MONGO_ID,
    },
    firstName: {
      type: 'string',
      description: 'The first name of the user.',
      example: 'John',
    },
    lastName: {
      type: 'string',
      description: 'The last name of the user.',
      example: 'Doe',
    },
    preferredName: {
      type: 'string',
      description: 'The preferred name of the user.',
      example: 'Johny',
    },
    email: {
      type: 'string',
      description: 'The email of the user.',
      example: 'johndoe@gmail.com',
    },
    phone: {
      type: 'string',
      description: 'The phone number of the user.',
      example: '123-456-7890',
    },
    oauthID: {
      type: 'string',
      description: 'The oauth ID of the user. This is not returned',
      example: '11111111',
    },
    genders: {
      description: 'The genders of the user.',
      type: 'array',
      items: {
        type: 'string',
        example: 'Woman',
      },
    },
    pronouns: {
      type: 'array',
      description: 'The pronouns of the user.',
      items: {
        type: 'string',
        example: 'She/Them',
      },
    },
    dateJoined: {
      type: 'string',
      description: 'The date the user joined the site.',
      example: '2020-01-01T00:00:00.000Z',
    },

    onboardingStatus: {
      type: 'string',
      description: 'The onboarding status of the user.',
      example: onboardingStatusEnum.ONBOARDED,
      enum: [...Object.values(onboardingStatusEnum)],
    },
    visitedPages: {
      type: 'array',
      description: 'The pages the user has visited.',
      items: {
        type: 'string',
        example: 'PITCH_DOC',
      },
    },
    profilePic: {
      type: 'string',
      description: 'The profile picture of the user.',
      example: 'https://www.example.com/profile.png',
    },
    portfolio: {
      type: 'string',
      description: 'The portfolio of the user.',
      example: 'https://www.example.com/portfolio.html',
    },
    linkedIn: {
      type: 'string',
      description: 'The LinkedIn profile of the user.',
      example: 'https://www.linkedin.com/in/johndoe',
    },
    twitter: {
      type: 'string',
      description: 'The Twitter profile of the user.',
      example: 'https://www.twitter.com/johndoe',
    },
    involvementResponse: {
      type: 'string',
      description: 'The involvement response of the user.',
      example: 'I am a great person!',
    },
    journalismResponse: {
      type: 'string',
      description: 'The journalism response of the user.',
      example: 'I am a great person!',
    },
    neighborhood: {
      type: 'string',
      description: 'The neighborhood of the user.',
      example: 'Downtown',
    },
    claimedPitches: {
      type: 'array',
      description: 'The pitches the user has claimed.',
      items: {
        type: 'string',
        ref: 'Pitch',
        example: EXAMPLE_MONGO_ID,
      },
    },
    submittedPitches: {
      type: 'array',
      description: 'The pitches the user has submitted.',
      items: {
        type: 'string',
        ref: 'Pitch',
        example: EXAMPLE_MONGO_ID,
      },
    },
    submittedClaims: {
      type: 'array',
      description: 'The claims the user has submitted.',
      items: {
        type: 'string',
        ref: 'Pitch',
        example: EXAMPLE_MONGO_ID,
      },
    },
    teams: {
      type: 'array',
      description: 'The teams the user is a member of.',
      items: {
        type: 'string',
        ref: 'Team',
        example: EXAMPLE_MONGO_ID,
      },
    },
    role: {
      type: 'string',
      description: 'The role of the user.',
      example: rolesEnum.ADMIN,
      enum: [...Object.values(rolesEnum)],
    },
    races: {
      type: 'array',
      description: 'The races of the user.',
      items: {
        type: 'string',
        example: racesEnum.ASIAN,
        enum: [...Object.values(racesEnum)],
      },
    },
    interests: {
      type: 'array',
      description: 'The interests of the user.',
      items: {
        type: 'string',
        example: 'Politics',
        ref: 'Interest',
      },
    },
    onboardReasoning: {
      type: 'string',
      description: 'The reasoning for the user being onboarded.',
      example: 'I am a great person!',
    },
    feedback: {
      type: 'array',
      description: 'The feedback for the user.',
      items: {
        type: 'string',
        ref: 'UserFeedback',
        example: 'This person is awesome!',
      },
    },
    lastActive: {
      type: 'string',
      description: 'The last active date of the user.',
      example: '2020-01-01T00:00:00.000Z',
    },
    fullname: {
      type: 'string',
      description:
        'The full name of the user. This is a virtual field. It is not returned. This field is calculated based on if the user has a prefererd name or whether the first name should be used.',
      example: 'John Doe',
    },
    activityStatus: {
      type: 'string',
      description:
        'The activity status of the user. This is a virtual field. It is not returned. This field is calculated based on the last active date.',
      example: 'ACTIVE',
      enum: ['ACTIVE', 'INACTIVE', 'RECENTLY_ACTIVE'],
    },
    joinedNames: {
      type: 'string',
      description:
        'The joined names of the user. This is a virtual field. It is not returned. This field is calculated by first name (preferred name) last name.',
      example: 'John (Johnny) Doe',
    },
  },
};
