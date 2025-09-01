export const typeDefs = `#graphql
  type Category {
    id: ID!
    name: String!
  }

  type Expense {
    id: ID!
    amount: Float!
    date: String!
    category: Category!
    note: String
    createdAt: String!
    updatedAt: String!
  }

  type Subscription {
    expenseCreated(userId: ID!): Expense!
  }

  type Query {
    _empty: String
  }
`;
