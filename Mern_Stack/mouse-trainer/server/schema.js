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

// User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
  }),
});

// Score Type
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

// Root Query
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

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const user = new User(args);
        return await user.save();
      }
    },
    addScore: {
      type: ScoreType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        score: { type: new GraphQLNonNull(GraphQLInt) },
        difficulty: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        const newScore = new Score(args);
        return newScore.save();
      }
    },
    login: {
      type: GraphQLString, // returns token
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, { username, password }) {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
          throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });
        return token;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
