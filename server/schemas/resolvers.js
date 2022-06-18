const { User, Thought } = require("../models");

const resolvers = {
    Query: {
        thoughts: async (parent, { username }) => {
            //if username exists use that if not return empty object
            const params = username ? { username } : {};
            //returning data in descending order based on sort createdAt
            return Thought.find(params).sort({ createdAt: -1 });
        }
    }
};

module.exports = resolvers;