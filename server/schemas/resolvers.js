const { User, Goal } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
          me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id });
                return userData;
            }
            else
            {
            throw new AuthenticationError('Error!Please login!');
            }
          },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email});
            if (!user) {
              throw new AuthenticationError('No user found with this email!');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials!');
            }
            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
        },

        
        saveGoal: async (parent, { goalData }, context) => {
          
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedGoals: goalData } },
                    { new: true }
                );
                console.log(updatedUser)
                return updatedUser
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        removeGoal: async (parent, args, context) => {
          if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedGoals: { goalId: args.goalId } } },
              { new: true }
            );
            return updatedUser
          }
          throw new AuthenticationError('Please login to remove a goal!');
        }
    }
}

module.exports = resolvers;