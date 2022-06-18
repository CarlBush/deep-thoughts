const { gql } = require("apollo-server-express");

//As a reminder, "reactions" are simply replies to or comments about a single thought.

const typeDefs = gql`

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
    thoughts(username: String): [Thought]
    }
`;



module.exports = typeDefs;