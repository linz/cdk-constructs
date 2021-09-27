import { IEcsApplication } from '@aws-cdk/aws-codedeploy';
import { Construct, Resource, IResource } from '@aws-cdk/core';
import { IEcsDeploymentConfig } from './ecs-deployment-config';
import { IEcsService } from './ecs-service';
export interface TrafficListener {
    /**
     * ARN of the listener
     * @attribute
     */
    readonly listenerArn: string;
}
/**
 * Interface for an ECS deployment group.
 */
export interface IEcsDeploymentGroup extends IResource {
    /**
     * The reference to the CodeDeploy ECS Application that this Deployment Group belongs to.
     */
    readonly application: IEcsApplication;
    /**
     * The physical name of the CodeDeploy Deployment Group.
     */
    readonly deploymentGroupName: string;
    /**
     * The ARN of this Deployment Group.
     */
    readonly deploymentGroupArn: string;
    /**
     * The Deployment Configuration this Group uses.
     */
    readonly deploymentConfig: IEcsDeploymentConfig;
}
export interface EcsDeploymentGroupProps {
    readonly applicationName?: string;
    readonly deploymentGroupName: string;
    readonly deploymentConfig?: IEcsDeploymentConfig;
    readonly ecsServices: IEcsService[];
    readonly targetGroupNames: string[];
    readonly prodTrafficListener: TrafficListener;
    readonly testTrafficListener: TrafficListener;
    /**
     * the number of minutes before deleting the original (blue) task set.
     * During an Amazon ECS deployment, CodeDeploy shifts traffic from the
     * original (blue) task set to a replacement (green) task set.
     *
     * The maximum setting is 2880 minutes (2 days).
     *
     * @default 60
     */
    readonly terminationWaitTimeInMinutes?: number;
    /**
     * The event type or types that trigger a rollback.
     */
    readonly autoRollbackOnEvents?: RollbackEvent[];
}
export declare class EcsDeploymentGroup extends Resource implements IEcsDeploymentGroup {
    readonly application: IEcsApplication;
    readonly deploymentGroupName: string;
    readonly deploymentGroupArn: string;
    readonly deploymentConfig: IEcsDeploymentConfig;
    constructor(scope: Construct, id: string, props: EcsDeploymentGroupProps);
    private arnForDeploymentGroup;
}
export declare enum RollbackEvent {
    DEPLOYMENT_FAILURE = "DEPLOYMENT_FAILURE",
    DEPLOYMENT_STOP_ON_ALARM = "DEPLOYMENT_STOP_ON_ALARM",
    DEPLOYMENT_STOP_ON_REQUEST = "DEPLOYMENT_STOP_ON_REQUEST"
}
