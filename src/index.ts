require("dotenv").config();
import express from "express";
import axios from "axios";
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();
const API_URL: string | undefined = process.env.SERVER;

const getBookings = async () => {
  const {
    data: { bookings },
  } = await axios.get(`${API_URL}/bookings-v3/get-many?date=2020-03-21`);
  return bookings;
};

const getBooingById = async (id: string) => {
  const {
    data: { booking },
  } = await axios.get(`${API_URL}/bookings-v3/get?id=${id}`);
  return booking;
};

const typeDefs = gql`
  type User {
    firstName: String
  }

  type Booking {
    acuityBookingId: String
    user: User
  }

  type Query {
    bookings: [Booking]
    booking(id: ID!): Booking
  }
`;

const resolvers = {
  Query: {
    bookings: () => getBookings(),
    booking: (parent: undefined, args: { [key: string]: string }) => {
      const { id } = args;
      return getBooingById(id);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
