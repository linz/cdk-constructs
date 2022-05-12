import { Cache, PipelineProject, BuildSpec, ComputeType, BuildEnvironmentVariable } from 'aws-cdk-lib/aws-codebuild';
import { IRepository } from 'aws-cdk-lib/aws-ecr';
import { IDummyTaskDefinition } from './dummy-task-definition';
import { Construct } from 'constructs';
export interface PushImageProjectProps {
    readonly imageRepository: IRepository;
    readonly taskDefinition: IDummyTaskDefinition;
    readonly environmentVariables?: Record<string, BuildEnvironmentVariable>;
    readonly projectName?: string;
    readonly cache?: Cache;
    readonly buildSpec?: BuildSpec;
    readonly computeType?: ComputeType;
}
export declare class PushImageProject extends PipelineProject {
    constructor(scope: Construct, id: string, props: PushImageProjectProps);
}
