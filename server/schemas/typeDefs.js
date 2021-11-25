const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID
    username: String
    email: String
    goalCount: Int
    savedGoals: [Goal]
  }
type Goal {
    _id:ID
    authors: [String]
    description: String
    name:String
}
input goalInput {
  
    authors: [String]
    description: String
    name: String
    
}
type Auth {
    token: ID!
    user: User
}
type Query {
    me: User
}
type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveGoal(goalData: goalInput!): User
    removeGoal(goalId: String!): User
}
`;

module.exports = typeDefs;