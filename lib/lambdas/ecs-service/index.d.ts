import type { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { ECS } from 'aws-sdk';
interface HandlerReturn {
    PhysicalResourceId: string;
    Data: {
        ServiceName: string;
    };
}
export interface BlueGreenServiceProps {
    cluster: string;
    serviceName: string;
    containerName: string;
    taskDefinition: string;
    launchType: string;
    platformVersion: string;
    desiredCount: number;
    subnets: string[];
    securityGroups: string[];
    targetGroupArn: string;
    containerPort: number;
    schedulingStrategy: string;
    healthCheckGracePeriodSeconds: number;
    deploymentConfiguration: ECS.DeploymentConfiguration;
}
export declare const handler: (event: CloudFormationCustomResourceEvent) => Promise<HandlerReturn | void>;
export {};
