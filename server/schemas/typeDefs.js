const { gql } = require("apollo-server-express");

//As a reminder, "reactions" are simply replies to or comments about a single thought.
//exclamation "!" (String!) in the query parameters is that the data MUST exist

const typeDefs = gql`

type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
}

type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
}

type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
}

type Query {
    users: [User]
    user(username: String!) : User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
    }
`;



module.exports = typeDefs;