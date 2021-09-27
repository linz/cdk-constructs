import type { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { CodeDeploy } from 'aws-sdk';
declare enum RollbackEvent {
    DEPLOYMENT_FAILURE = "DEPLOYMENT_FAILURE",
    DEPLOYMENT_STOP_ON_ALARM = "DEPLOYMENT_STOP_ON_ALARM",
    DEPLOYMENT_STOP_ON_REQUEST = "DEPLOYMENT_STOP_ON_REQUEST"
}
interface HandlerReturn {
    PhysicalResourceId: string;
}
export interface EcsDeploymentGroupProps {
    applicationName: string;
    deploymentGroupName: string;
    serviceRoleArn: string;
    ecsServices: CodeDeploy.ECSServiceList;
    targetGroupNames: string[];
    prodTrafficListenerArn: string;
    testTrafficListenerArn: string;
    terminationWaitTimeInMinutes: number;
    autoRollbackOnEvents?: RollbackEvent[];
    deploymentConfigName?: string;
}
export declare const handler: (event: CloudFormationCustomResourceEvent) => Promise<HandlerReturn | void>;
export {};
