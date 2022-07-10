import { Resource, IResource, Duration, ITaggable, TagManager } from 'aws-cdk-lib';
import { IEcsApplication } from 'aws-cdk-lib/aws-codedeploy';
import { ApplicationTargetGroup } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
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
    /**
     * The CodeDeploy Application to associate to the DeploymentGroup.
     *
     * @default - create a new CodeDeploy Application.
     */
    readonly application?: IEcsApplication;
    /**
     * The name to use for the implicitly created CodeDeploy Application.
     *
     * @default - uses auto-generated name
     * @deprecated Use {@link application} instead to create a custom CodeDeploy Application.
     */
    readonly applicationName?: string;
    readonly deploymentGroupName: string;
    readonly deploymentConfig?: IEcsDeploymentConfig;
    readonly ecsServices: IEcsService[];
    readonly targetGroups: ApplicationTargetGroup[];
    readonly prodTrafficListener: TrafficListener;
    readonly testTrafficListener: TrafficListener;
    /**
     * the number of minutes before deleting the original (blue) task set.
     * During an Amazon ECS deployment, CodeDeploy shifts traffic from the
     * original (blue) task set to a replacement (green) task set.
     *
     * The maximum setting is 2880 minutes (2 days).
     *
     * @default 60 minutes
     */
    readonly terminationWaitTime?: Duration;
    /**
     * The event type or types that trigger a rollback.
     */
    readonly autoRollbackOnEvents?: RollbackEvent[];
}
export declare class EcsDeploymentGroup extends Resource implements IEcsDeploymentGroup, ITaggable {
    readonly application: IEcsApplication;
    readonly deploymentGroupName: string;
    readonly deploymentGroupArn: string;
    readonly deploymentConfig: IEcsDeploymentConfig;
    readonly tags: TagManager;
    constructor(scope: Construct, id: string, props: EcsDeploymentGroupProps);
}
export declare enum RollbackEvent {
    DEPLOYMENT_FAILURE = "DEPLOYMENT_FAILURE",
    DEPLOYMENT_STOP_ON_ALARM = "DEPLOYMENT_STOP_ON_ALARM",
    DEPLOYMENT_STOP_ON_REQUEST = "DEPLOYMENT_STOP_ON_REQUEST"
}
