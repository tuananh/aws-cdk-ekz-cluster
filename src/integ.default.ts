import * as ec2 from '@aws-cdk/aws-ec2';
import { App, Stack, CfnOutput, RemovalPolicy } from '@aws-cdk/core';
import * as k0s from './';

export class IntegTesting {
  readonly stack: Stack[];

  constructor() {
    const app = new App();
    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new Stack(app, 'testing-stack', { env });

    const vpc = k0s.VpcProvider.getOrCreate(stack);

    const cluster = new k0s.Cluster(stack, 'Cluster', {
      vpc,
      spotWorkerNodes: true,
      workerMinCapacity: 1,
      workerInstanceType: new ec2.InstanceType('m6g.medium'),
      controlPlaneInstanceType: new ec2.InstanceType('m6g.medium'),
      bucketRemovalPolicy: RemovalPolicy.DESTROY,
    });

    new CfnOutput(stack, 'EndpointURI', { value: cluster.endpointUri });
    new CfnOutput(stack, 'Region', { value: Stack.of(stack).region });
    this.stack = [stack];
  };
}

// run the integ testing
new IntegTesting();
