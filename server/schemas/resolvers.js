const { User, Thought } = require("../models");

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
        }
    }
};

module.exports = resolvers;