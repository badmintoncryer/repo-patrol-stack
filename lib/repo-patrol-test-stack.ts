import * as cdk from "aws-cdk-lib/core";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { RepoPatrol } from "repo-patrol";

export class RepoPatrolTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const githubAppSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "GitHubAppSecret",
      "repo-patrol/github-app",
    );

    new RepoPatrol(this, "Patrol", {
      githubAppSecret,
      dryRun: false,
      enableDashboard: true,
      adminEmails: ["malaysia.cryer@gmail.com"],
    });
  }
}
