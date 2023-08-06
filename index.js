const { ApolloServer }  = require('apollo-server');
const mongoose = require('mongoose');
 require('dotenv').config(); 

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

//const MONGODB = env.MONGODB_URI; 



const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
    .then(() => {
        console.log("MongoDB Connected");
        return server.listen({port: 5000});
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`)
    });