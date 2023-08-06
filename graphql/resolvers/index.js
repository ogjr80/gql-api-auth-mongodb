const messagesResolvers = require('./messages');
const userResolvers = require('./user'); 


module.exports = {
    Query: {
        ...messagesResolvers.Query, 
        ...userResolvers.Query
    },
    Mutation: {
        ...messagesResolvers.Mutation, 
        ...userResolvers.Mutation
    },
};