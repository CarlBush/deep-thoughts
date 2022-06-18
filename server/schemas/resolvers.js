const { User, Thought } = require("../models");

/*resolver options in the following order
parent - nested resolvers to handle more complicated actions, as it would hold the reference to the resolver that executed the nested resolver function.
arg - object of all of the values passed into a query or mutation request as parameters. EX: username
context - same data to be accessible by all resolvers
info - contain extra information about an operation's current state
*/


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