import { PolicyStatement, IRole } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
export interface IDummyTaskDefinition {
    readonly executionRole: IRole;
    readonly family: string;
    readonly taskDefinitionArn: string;
    readonly containerName: string;
    readonly containerPort: number;
}
export interface DummyTaskDefinitionProps {
    /**
     * The name of a family that this task definition is registered to. A family groups multiple versions of a task definition.
     *
     * @default - Automatically generated name.
     */
    readonly family?: string;
    /**
     * The image used to start a container.
     */
    readonly image: string;
    /**
     * The name of the container.
     *
     * @default `sample-website`
     */
    readonly containerName?: string;
    /**
     * @default 80
     */
    readonly containerPort?: number;
}
export declare class DummyTaskDefinition extends Construct implements IDummyTaskDefinition {
    readonly executionRole: IRole;
    readonly family: string;
    readonly taskDefinitionArn: string;
    readonly containerName: string;
    readonly containerPort: number;
    constructor(scope: Construct, id: string, props: DummyTaskDefinitionProps);
    /**
     * Adds a policy statement to the task execution IAM role.
     */
    addToExecutionRolePolicy(statement: PolicyStatement): void;
}
