import * as cdk from "aws-cdk-lib/core";
import { ScheduleExpression } from "aws-cdk-lib/aws-scheduler";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { RepoPatrol, JobType, RepositoryConfig } from "repo-patrol";

const ALL_JOBS = {
  [JobType.REVIEW_PULL_REQUESTS]: {},
  [JobType.TRIAGE_ISSUES]: {},
  [JobType.HANDLE_DEPENDABOT]: {},
  [JobType.ANALYZE_CI_FAILURES]: {},
  [JobType.CHECK_DEPENDENCIES]: {},
  [JobType.REPO_HEALTH_CHECK]: {},
};

const CDK_CONSTRUCT_REPOS = [
  "cdk-iot-core-certificates-v3",
  "cdk-code-server",
  "cdk-missing-interface-endpoint",
  "cdk-unsupported-property-app",
  "cloud-duck",
  "cdk-preinstalled-amazon-linux-ec2",
  "cdk-vpc-endpoint-with-private-ip",
  "cdk-private-s3-hosting",
  "cdk-unsupported-property",
  "cdk-rds-scheduler",
  "cdk-rds-dump",
  "cdk-node-ec2-instance",
  "cdk-watchful",
];

export class RepoPatrolStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const githubAppSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "GitHubAppSecret",
      "repo-patrol/github-app",
    );

    // Monthly schedule: 1st of every month at 00:00 UTC
    const monthly = ScheduleExpression.cron({
      minute: "0",
      hour: "0",
      day: "1",
      month: "*",
      year: "*",
    });

    const repositories: RepositoryConfig[] = CDK_CONSTRUCT_REPOS.map((repo) => ({
      owner: "badmintoncryer",
      repo,
      jobs: Object.fromEntries(Object.keys(ALL_JOBS).map((job) => [job, { schedule: monthly }])),
    }));

    new RepoPatrol(this, "Patrol", {
      githubAppSecret,
      dryRun: false,
      enableDashboard: true,
      adminEmails: ["malaysia.cryer@gmail.com"],
      repositories,
    });
  }
}
