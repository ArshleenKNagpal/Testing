import {gql} from '@apollo/client';

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
login(email: $email, password: $password){
token
user {
    _id
    username
        }
    }
}
`;

export const ADD_USER = gql`
mutation addUser($username: String!, $email: String!, $password: String!){
    addUser(username: $username, email: $email, password: $password){
        token
        user {
            _id
            username
        }
    }
}
`;

export const SAVE_BOOK = gql`
mutation saveGoal($goalData: goalInput!){
    saveGoal(goalData: $goalData) {
        _id
        username
        email 
        savedGoals {
            goalId
            authors
            description
            title
            image
            link
        }
    }
}
`;

export const REMOVE_BOOK = gql`
mutation removeGoal($goalId: String!){
    removeGoal(goalId: $goalId) {
        _id
        username
        email 
        savedGoals {
            goalId
            authors
            description
            title
            image
            link
        }
    }
}
`;