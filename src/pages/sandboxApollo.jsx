import React, { Component, useState, useEffect } from "react";
import { useQuery } from '@apollo/react-hooks'

// import {ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from 'apollo-utilities';

import { ApolloProvider } from '@apollo/client';
import { WebSocketLink } from "apollo-link-ws"


import { setContext } from '@apollo/client/link/context';

import Settings from "../Settings";
import SingleTimeSerie from "../SingleTimeSerie";


import CircularProgress from '@mui/material';
import { MyCard, MyCardHeader } from "../components/StyledComponents"

import AWSAppSyncClient from 'aws-appsync'

import { SandboxQl } from "./sandboxQl-List"
import { SandboxQlSub } from "./sandboxQlSub"


import { useStyles } from "../Styles"


const endpointHttp = "https://dfmsa6fzibhrrm3byqhancekju.appsync-api.eu-central-1.amazonaws.com/graphql";
const endpointWs = "wss://dfmsa6fzibhrrm3byqhancekju.appsync-api.eu-central-1.amazonaws.com/graphql";
// const endpoint = "ws://dfmsa6fzibhrrm3byqhancekju.appsync-api.eu-central-1.amazonaws.com/graphql";




export const Sandbox = ({ username, token, listid, listtype }) => {

  const awsmobile = {
    "aws_project_region": "eu-central-1",
    "aws_appsync_graphqlEndpoint": endpointHttp,
    "aws_appsync_region": "eu-central-1",
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": "da2-gfzrpxlrh5biva2pobeoyfex4m"
  };

  const client = new AWSAppSyncClient({
    url: awsmobile.aws_appsync_graphqlEndpoint,
    region: awsmobile.region,
    auth: {
      type: awsmobile.aws_appsync_authenticationType,
      apiKey: awsmobile.aws_appsync_apiKey,
      // jwtToken: async () => token, // Required when you use Cognito UserPools OR OpenID Connect. token object is obtained previously
    }
  })

  return (
      <></>
  )
}
