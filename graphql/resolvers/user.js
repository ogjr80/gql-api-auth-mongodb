const User = require('../../models/User'); 
const { ApolloError} = require('apollo-server-errors')
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
module.exports = {
    Mutation: {
        async registerUser(_, {registerInput: { username, email, password}}) {
                //see if an old user exists with email attempting to register 
                const oldUser = await User.findOne({email}); 

                //throw new error if that user esits 
                if(oldUser){
                    throw new ApolloError('A user is already register with the email' + email, 'USER_ALREADY_EXISTS')
                }

                //encrypt password 
                var encryptedPassword  = await bcrypt.hash(password, 10); 

                
                //Build out the mongoose model (User)
                const newUser = new User({
                    username: username, 
                    email: email.toLowerCase(), 
                    password: encryptedPassword
                })

                //create our Jwt (attach to our user model); 
                const  token = jwt.sign(
                    {user_id: newUser._id, email}, 
                    "UNSAFE_STRING", 
                    {
                        expiresIn: "2h"
                    }
                ); 
                    newUser.token = token; 

                //save our user in mongo db. 
                const res = await newUser.save(); 
                return { 
                    id: res.id, 
                    ...res._doc
                }
              

        }, 
        async loginUser(_, {loginInput: {email, password}}){
            // see if you user exist 
            const user = await User.findOne({email}); 

            //check if the entered password is equal the encrypted password 
            if(user && (await bcrypt.compare(password, user.password))) {
                //create a new token
                const  token = jwt.sign(
                    {user_id: user._id, email}, 
                    "UNSAFE_STRING", 
                    {
                        expiresIn: "2h"
                    }
                ); 
                //attach token to user model above.
                user.token = token;      
                return {
                    id: user.id, 
                    ...user._doc
                }
                } else { 
                    throw new ApolloError('Incorrect password', 'INCORRECT_PASSWORD')
                }

            
        }
    }, 
    Query : {
        user:  (_, {ID}) => User.findById(ID)

    }
}