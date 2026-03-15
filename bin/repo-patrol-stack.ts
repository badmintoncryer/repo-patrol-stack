#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { RepoPatrolStack } from "../lib/repo-patrol-stack";

const app = new cdk.App();
new RepoPatrolStack(app, "RepoPatrol", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
