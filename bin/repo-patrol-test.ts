#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { RepoPatrolTestStack } from "../lib/repo-patrol-test-stack";

const app = new cdk.App();
new RepoPatrolTestStack(app, "RepoPatrol", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
