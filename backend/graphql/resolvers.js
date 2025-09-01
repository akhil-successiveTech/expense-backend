import { PubSub } from "graphql-subscriptions";

export const pubsub = new PubSub();

export const EVENTS = {
  EXPENSE_CREATED: "EXPENSE_CREATED",
};

export const resolvers = {
  Query: {
    _empty: () => "ok",
  },
  Subscription: {
    expenseCreated: {
      subscribe: (_, { userId }) =>
        pubsub.asyncIterableIterator(EVENTS.EXPENSE_CREATED, {
          filter: (payload) => payload.userId === payload.expenseCreatedUserId,
        }),
      resolve: (payload) => payload.expenseCreated,
    },
  },
};