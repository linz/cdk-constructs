import type { CloudFormationCustomResourceEvent } from 'aws-lambda';
interface HandlerReturn {
    PhysicalResourceId: string;
}
export interface EcsTaskDefinitionProps {
    family: string;
    image: string;
    executionRoleArn: string;
    networkMode: string;
    containerName: string;
    containerPort: number;
}
export declare const handler: (event: CloudFormationCustomResourceEvent) => Promise<HandlerReturn | void>;
export {};
