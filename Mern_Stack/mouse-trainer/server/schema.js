const jwt = require('jsonwebtoken');
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');
const User = require('./models/User');
const Score = require('./models/Score');

// 📦 User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
  }),
});

// 🧀 Score Type
const ScoreType = new GraphQLObjectType({
  name: 'Score',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    score: { type: GraphQLInt },
    difficulty: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  }),
});

// 🔐 Auth Payload Type (for register/login responses)
const AuthPayloadType = new GraphQLObjectType({
  name: 'AuthPayload',
  fields: () => ({
    token: { type: GraphQLString },
    user: { type: UserType }
  })
});

// 🔍 Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    scores: {
      type: new GraphQLList(ScoreType),
      args: { difficulty: { type: GraphQLString } },
      resolve(parent, args) {
        return Score.find(args.difficulty ? { difficulty: args.difficulty } : {});
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find();
      }
    }
  }
});

// 🛠️ Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: {
      type: AuthPayloadType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, { username, password }) {
        const existing = await User.findOne({ username });
        if (existing) {
          throw new Error('Username already exists');
        }

        const user = new User({ username, password });
        const savedUser = await user.save();

        const token = jwt.sign(
          { id: savedUser._id, username: savedUser.username },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return {
          token,
          user: savedUser
        };
      }
    },

    login: {
      type: AuthPayloadType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, { username, password }) {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
          { id: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return {
          token,
          user
        };
      }
    },

    addScore: {
      type: ScoreType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        score: { type: new GraphQLNonNull(GraphQLInt) },
        difficulty: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, args) {
        const newScore = new Score(args);
        return newScore.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
