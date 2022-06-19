const { User, Thought } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

/*resolver options in the following order
parent - nested resolvers to handle more complicated actions, as it would hold the reference to the resolver that executed the nested resolver function.
arg - object of all of the values passed into a query or mutation request as parameters. EX: username
context - same data to be accessible by all resolvers
info - contain extra information about an operation's current state
*/

/*QUERY EXAMPLE WITH PARAMETER FROM FRONT END

query getSingleUser($username: String!) {
  user(username: $username) {
    username
    friendCount
    thoughts {
      thoughtText
      createdAt
    }
    friends {
      username
    }
  }
}

{
  "username": "Deborah61"
}
*/

const resolvers = {
    Query: {
        //QUERY thoughts(username: String): [Thought]
        thoughts: async (parent, { username }) => {
            //if username exists use that if not return empty object
            const params = username ? { username } : {};
            //returning data in descending order based on sort createdAt
            return Thought.find(params).sort({ createdAt: -1 });
        },
        //QUERY thought(_id: ID!): Thought | GET SINGLE THOUGHT
        thought: async (parent, { _id }) => {
            return Thought.findOne({ _id });
        },
        //QUERY users: [User] | GET ALL USERS
        users: async () => {
            return User.find()
                .select("-__V -password")
                .populate("friends")
                .populate("thoughts");
        },
        //QUERY user(username: String!) : User | GET SINGLE USER
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select("-__V -password")
                .populate("friends")
                .populate("thoughts");
        },
        //QUERY me: User | Used for Token
        //context located in server.js and auth.js to work
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user_id })
                    .select("-__V -password")
                    .populate("friends")
                    .populate("thoughts");

                return userData;
            }
            throw new AuthenticationError("Not Logged In");
        }
    },
    Mutation: {
        //EX: addUser(username:"tester", password:"test12345", email:"test@test.com") = args
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };

        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const token = signToken(user);
            return { token, user };
        },
        //ONLY LOGGED IN USERS CAN USE THIS MUTATION
        //QUERY addThought(thoughtText: String!): Thought
        addThought: async (parent, args, context) => {
            if (context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { thoughts: thought.__id } },
                    { new: true }
                );
                return thought;
            }
            throw new AuthenticationError("You need to be logged in!");
        },
        //Reactions are stored as arrays on the Thought model
        //QUERY addReaction(thoughtId: ID!, reactionBody: String!): Thought
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId },
                    { $push: { reactions: { reactionBody, username: context.user.username } } },
                    { new: true, runValidators: true }
                );

                return updatedThought;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        //look for an incoming friendId and add that to the current user's friends array
        //QUERY addFriend(friendId: ID!): User
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;