import * as cdk from "aws-cdk-lib/core";
import { Duration } from "aws-cdk-lib";
import { ScheduleExpression } from "aws-cdk-lib/aws-scheduler";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { RepoPatrol, JobType } from "repo-patrol";

export class RepoPatrolStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const githubAppSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "GitHubAppSecret",
      "repo-patrol/github-app",
    );

    // Monthly schedule: 1st of every month at 00:00 UTC
    const monthly = ScheduleExpression.cron({ minute: "0", hour: "0", day: "1", month: "*", year: "*" });

    new RepoPatrol(this, "Patrol", {
      githubAppSecret,
      dryRun: false,
      enableDashboard: true,
      adminEmails: ["malaysia.cryer@gmail.com"],
      repositories: [
        {
          owner: "badmintoncryer",
          repo: "cdk-iot-core-certificates-v3",
          jobs: {
            [JobType.REVIEW_PULL_REQUESTS]: { schedule: monthly },
            [JobType.TRIAGE_ISSUES]: { schedule: monthly },
            [JobType.HANDLE_DEPENDABOT]: { schedule: monthly },
            [JobType.ANALYZE_CI_FAILURES]: { schedule: monthly },
            [JobType.CHECK_DEPENDENCIES]: { schedule: monthly },
            [JobType.REPO_HEALTH_CHECK]: { schedule: monthly },
          },
        },
      ],
    });
  }
}
