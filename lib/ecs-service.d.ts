import { Duration, ITaggable, TagManager } from 'aws-cdk-lib';
import { IConnectable, Connections, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { ICluster, LaunchType, DeploymentCircuitBreaker } from 'aws-cdk-lib/aws-ecs';
import { ITargetGroup } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
import { DummyTaskDefinition } from './dummy-task-definition';
export interface IEcsService {
    readonly clusterName: string;
    readonly serviceName: string;
}
export interface EcsServiceProps {
    readonly securityGroups?: SecurityGroup[];
    readonly cluster: ICluster;
    readonly serviceName: string;
    readonly launchType?: LaunchType;
    readonly platformVersion?: string;
    readonly desiredCount?: number;
    readonly containerPort?: number;
    readonly prodTargetGroup: ITargetGroup;
    readonly testTargetGroup: ITargetGroup;
    readonly taskDefinition: DummyTaskDefinition;
    /**
     * The period of time, in seconds, that the Amazon ECS service scheduler ignores unhealthy
     * Elastic Load Balancing target health checks after a task has first started.
     *
     * @default - defaults to 60 seconds if at least one load balancer is in-use and it is not already set
     */
    readonly healthCheckGracePeriod?: Duration;
    /**
     * The maximum number of tasks, specified as a percentage of the Amazon ECS
     * service's DesiredCount value, that can run in a service during a
     * deployment.
     *
     * @default - 100 if daemon, otherwise 200
     */
    readonly maxHealthyPercent?: number;
    /**
     * The minimum number of tasks, specified as a percentage of
     * the Amazon ECS service's DesiredCount value, that must
     * continue to run and remain healthy during a deployment.
     *
     * @default - 0 if daemon, otherwise 50
     */
    readonly minHealthyPercent?: number;
    /**
     * Whether to enable the deployment circuit breaker. If this property is defined, circuit breaker will be implicitly
     * enabled.
     * @default - disabled
     */
    readonly circuitBreaker?: DeploymentCircuitBreaker;
    /**
     * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service. If no value is specified, the tags aren't propagated.
     * @default - no propagate
     */
    readonly propagateTags?: PropagateTags;
}
export declare class EcsService extends Construct implements IConnectable, IEcsService, ITaggable {
    readonly clusterName: string;
    readonly serviceName: string;
    readonly connections: Connections;
    readonly tags: TagManager;
    constructor(scope: Construct, id: string, props: EcsServiceProps);
}
export declare enum SchedulingStrategy {
    REPLICA = "REPLICA",
    DAEMON = "DAEMON"
}
export declare enum PropagateTags {
    TASK_DEFINITION = "TASK_DEFINITION",
    SERVICE = "SERVICE"
}
