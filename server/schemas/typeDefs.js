const { gql } = require("apollo-server-express");

const typeDefs = gql`

type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
}

type Query {
    thoughts(username: String): [Thought]
    }
`;



module.exports = typeDefs;