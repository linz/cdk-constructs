"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyTaskDefinition = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const custom_resources_1 = require("aws-cdk-lib/custom-resources");
const constructs_1 = require("constructs");
class DummyTaskDefinition extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.tags = new aws_cdk_lib_1.TagManager(aws_cdk_lib_1.TagType.STANDARD, 'TagManager');
        this.executionRole = new aws_iam_1.Role(this, `${id}-ER`, {
            assumedBy: new aws_iam_1.ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')],
        });
        this.family = props.family ?? this.node.addr;
        this.containerName = props.containerName ?? 'sample-website';
        this.containerPort = props.containerPort ?? 80;
        const registerTaskDefinition = {
            service: 'ECS',
            action: 'registerTaskDefinition',
            parameters: {
                requiresCompatibilities: ['FARGATE'],
                family: this.family,
                executionRoleArn: this.executionRole.roleArn,
                networkMode: aws_ecs_1.NetworkMode.AWS_VPC,
                cpu: '256',
                memory: '512',
                containerDefinitions: [
                    {
                        name: this.containerName,
                        image: props.image,
                        portMappings: [
                            {
                                hostPort: this.containerPort,
                                protocol: 'tcp',
                                containerPort: this.containerPort,
                            },
                        ],
                    },
                ],
                tags: aws_cdk_lib_1.Lazy.any({ produce: () => this.tags.renderTags() }),
            },
            physicalResourceId: custom_resources_1.PhysicalResourceId.fromResponse('taskDefinition.taskDefinitionArn'),
        };
        const deregisterTaskDefinition = {
            service: 'ECS',
            action: 'deregisterTaskDefinition',
            parameters: {
                taskDefinition: new custom_resources_1.PhysicalResourceIdReference(),
            },
        };
        const taskDefinition = new custom_resources_1.AwsCustomResource(this, `${id}-CRTask`, {
            resourceType: 'Custom::DummyTaskDefinition',
            onCreate: registerTaskDefinition,
            onUpdate: registerTaskDefinition,
            onDelete: deregisterTaskDefinition,
            policy: custom_resources_1.AwsCustomResourcePolicy.fromStatements([
                new aws_iam_1.PolicyStatement({
                    effect: aws_iam_1.Effect.ALLOW,
                    actions: ['ecs:RegisterTaskDefinition', 'ecs:DeregisterTaskDefinition'],
                    resources: ['*'],
                }),
                new aws_iam_1.PolicyStatement({
                    effect: aws_iam_1.Effect.ALLOW,
                    actions: ['iam:PassRole'],
                    resources: [this.executionRole.roleArn],
                }),
            ]),
        });
        this.taskDefinitionArn = taskDefinition.getResponseField('taskDefinition.taskDefinitionArn');
    }
    /**
     * Adds a policy statement to the task execution IAM role.
     */
    addToExecutionRolePolicy(statement) {
        this.executionRole.addToPrincipalPolicy(statement);
    }
}
exports.DummyTaskDefinition = DummyTaskDefinition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtbXktdGFzay1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2R1bW15LXRhc2stZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBbUU7QUFDbkUsaURBQWtEO0FBQ2xELGlEQUE0RztBQUM1RyxtRUFNc0M7QUFDdEMsMkNBQXVDO0FBdUN2QyxNQUFhLG1CQUFvQixTQUFRLHNCQUFTO0lBYWhELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBK0I7UUFDdkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksd0JBQVUsQ0FBQyxxQkFBTyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO1lBQzlDLFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHlCQUF5QixDQUFDO1lBQzFELGVBQWUsRUFBRSxDQUFDLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUMzRyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDN0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxJQUFJLGdCQUFnQixDQUFDO1FBQzdELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUM7UUFFL0MsTUFBTSxzQkFBc0IsR0FBZTtZQUN6QyxPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRSx3QkFBd0I7WUFDaEMsVUFBVSxFQUFFO2dCQUNWLHVCQUF1QixFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNwQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLGdCQUFnQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTztnQkFDNUMsV0FBVyxFQUFFLHFCQUFXLENBQUMsT0FBTztnQkFDaEMsR0FBRyxFQUFFLEtBQUs7Z0JBQ1YsTUFBTSxFQUFFLEtBQUs7Z0JBQ2Isb0JBQW9CLEVBQUU7b0JBQ3BCO3dCQUNFLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYTt3QkFDeEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO3dCQUNsQixZQUFZLEVBQUU7NEJBQ1o7Z0NBQ0UsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhO2dDQUM1QixRQUFRLEVBQUUsS0FBSztnQ0FDZixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7NkJBQ2xDO3lCQUNGO3FCQUNGO2lCQUNGO2dCQUNELElBQUksRUFBRSxrQkFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUM7YUFDMUQ7WUFDRCxrQkFBa0IsRUFBRSxxQ0FBa0IsQ0FBQyxZQUFZLENBQUMsa0NBQWtDLENBQUM7U0FDeEYsQ0FBQztRQUVGLE1BQU0sd0JBQXdCLEdBQWU7WUFDM0MsT0FBTyxFQUFFLEtBQUs7WUFDZCxNQUFNLEVBQUUsMEJBQTBCO1lBQ2xDLFVBQVUsRUFBRTtnQkFDVixjQUFjLEVBQUUsSUFBSSw4Q0FBMkIsRUFBRTthQUNsRDtTQUNGLENBQUM7UUFFRixNQUFNLGNBQWMsR0FBRyxJQUFJLG9DQUFpQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFO1lBQ2pFLFlBQVksRUFBRSw2QkFBNkI7WUFDM0MsUUFBUSxFQUFFLHNCQUFzQjtZQUNoQyxRQUFRLEVBQUUsc0JBQXNCO1lBQ2hDLFFBQVEsRUFBRSx3QkFBd0I7WUFDbEMsTUFBTSxFQUFFLDBDQUF1QixDQUFDLGNBQWMsQ0FBQztnQkFDN0MsSUFBSSx5QkFBZSxDQUFDO29CQUNsQixNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO29CQUNwQixPQUFPLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSw4QkFBOEIsQ0FBQztvQkFDdkUsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO2lCQUNqQixDQUFDO2dCQUNGLElBQUkseUJBQWUsQ0FBQztvQkFDbEIsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztvQkFDcEIsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO29CQUN6QixTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztpQkFDeEMsQ0FBQzthQUNILENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsY0FBYyxDQUFDLGdCQUFnQixDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVEOztPQUVHO0lBQ0ksd0JBQXdCLENBQUMsU0FBMEI7UUFDeEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyRCxDQUFDO0NBQ0Y7QUEzRkQsa0RBMkZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVRhZ2dhYmxlLCBUYWdNYW5hZ2VyLCBUYWdUeXBlLCBMYXp5IH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgTmV0d29ya01vZGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IFJvbGUsIFNlcnZpY2VQcmluY2lwYWwsIE1hbmFnZWRQb2xpY3ksIFBvbGljeVN0YXRlbWVudCwgRWZmZWN0LCBJUm9sZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHtcbiAgQXdzQ3VzdG9tUmVzb3VyY2UsXG4gIEF3c0N1c3RvbVJlc291cmNlUG9saWN5LFxuICBBd3NTZGtDYWxsLFxuICBQaHlzaWNhbFJlc291cmNlSWQsXG4gIFBoeXNpY2FsUmVzb3VyY2VJZFJlZmVyZW5jZSxcbn0gZnJvbSAnYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBJRHVtbXlUYXNrRGVmaW5pdGlvbiB7XG4gIHJlYWRvbmx5IGV4ZWN1dGlvblJvbGU6IElSb2xlO1xuXG4gIHJlYWRvbmx5IGZhbWlseTogc3RyaW5nO1xuXG4gIHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uQXJuOiBzdHJpbmc7XG5cbiAgcmVhZG9ubHkgY29udGFpbmVyTmFtZTogc3RyaW5nO1xuXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ6IG51bWJlcjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRHVtbXlUYXNrRGVmaW5pdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIGEgZmFtaWx5IHRoYXQgdGhpcyB0YXNrIGRlZmluaXRpb24gaXMgcmVnaXN0ZXJlZCB0by4gQSBmYW1pbHkgZ3JvdXBzIG11bHRpcGxlIHZlcnNpb25zIG9mIGEgdGFzayBkZWZpbml0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIG5hbWUuXG4gICAqL1xuICByZWFkb25seSBmYW1pbHk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBpbWFnZSB1c2VkIHRvIHN0YXJ0IGEgY29udGFpbmVyLlxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2U6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgYHNhbXBsZS13ZWJzaXRlYFxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQGRlZmF1bHQgODBcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBEdW1teVRhc2tEZWZpbml0aW9uIGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSUR1bW15VGFza0RlZmluaXRpb24sIElUYWdnYWJsZSB7XG4gIHB1YmxpYyByZWFkb25seSBleGVjdXRpb25Sb2xlOiBJUm9sZTtcblxuICBwdWJsaWMgcmVhZG9ubHkgZmFtaWx5OiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uQXJuOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNvbnRhaW5lck5hbWU6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgY29udGFpbmVyUG9ydDogbnVtYmVyO1xuXG4gIHB1YmxpYyByZWFkb25seSB0YWdzOiBUYWdNYW5hZ2VyO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBEdW1teVRhc2tEZWZpbml0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy50YWdzID0gbmV3IFRhZ01hbmFnZXIoVGFnVHlwZS5TVEFOREFSRCwgJ1RhZ01hbmFnZXInKTtcblxuICAgIHRoaXMuZXhlY3V0aW9uUm9sZSA9IG5ldyBSb2xlKHRoaXMsIGAke2lkfS1FUmAsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnc2VydmljZS1yb2xlL0FtYXpvbkVDU1Rhc2tFeGVjdXRpb25Sb2xlUG9saWN5JyldLFxuICAgIH0pO1xuXG4gICAgdGhpcy5mYW1pbHkgPSBwcm9wcy5mYW1pbHkgPz8gdGhpcy5ub2RlLmFkZHI7XG4gICAgdGhpcy5jb250YWluZXJOYW1lID0gcHJvcHMuY29udGFpbmVyTmFtZSA/PyAnc2FtcGxlLXdlYnNpdGUnO1xuICAgIHRoaXMuY29udGFpbmVyUG9ydCA9IHByb3BzLmNvbnRhaW5lclBvcnQgPz8gODA7XG5cbiAgICBjb25zdCByZWdpc3RlclRhc2tEZWZpbml0aW9uOiBBd3NTZGtDYWxsID0ge1xuICAgICAgc2VydmljZTogJ0VDUycsXG4gICAgICBhY3Rpb246ICdyZWdpc3RlclRhc2tEZWZpbml0aW9uJyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgcmVxdWlyZXNDb21wYXRpYmlsaXRpZXM6IFsnRkFSR0FURSddLFxuICAgICAgICBmYW1pbHk6IHRoaXMuZmFtaWx5LFxuICAgICAgICBleGVjdXRpb25Sb2xlQXJuOiB0aGlzLmV4ZWN1dGlvblJvbGUucm9sZUFybixcbiAgICAgICAgbmV0d29ya01vZGU6IE5ldHdvcmtNb2RlLkFXU19WUEMsXG4gICAgICAgIGNwdTogJzI1NicsXG4gICAgICAgIG1lbW9yeTogJzUxMicsXG4gICAgICAgIGNvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogdGhpcy5jb250YWluZXJOYW1lLFxuICAgICAgICAgICAgaW1hZ2U6IHByb3BzLmltYWdlLFxuICAgICAgICAgICAgcG9ydE1hcHBpbmdzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBob3N0UG9ydDogdGhpcy5jb250YWluZXJQb3J0LFxuICAgICAgICAgICAgICAgIHByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICAgICAgICBjb250YWluZXJQb3J0OiB0aGlzLmNvbnRhaW5lclBvcnQsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHRhZ3M6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy50YWdzLnJlbmRlclRhZ3MoKSB9KSxcbiAgICAgIH0sXG4gICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5mcm9tUmVzcG9uc2UoJ3Rhc2tEZWZpbml0aW9uLnRhc2tEZWZpbml0aW9uQXJuJyksXG4gICAgfTtcblxuICAgIGNvbnN0IGRlcmVnaXN0ZXJUYXNrRGVmaW5pdGlvbjogQXdzU2RrQ2FsbCA9IHtcbiAgICAgIHNlcnZpY2U6ICdFQ1MnLFxuICAgICAgYWN0aW9uOiAnZGVyZWdpc3RlclRhc2tEZWZpbml0aW9uJyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgdGFza0RlZmluaXRpb246IG5ldyBQaHlzaWNhbFJlc291cmNlSWRSZWZlcmVuY2UoKSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IEF3c0N1c3RvbVJlc291cmNlKHRoaXMsIGAke2lkfS1DUlRhc2tgLCB7XG4gICAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206OkR1bW15VGFza0RlZmluaXRpb24nLFxuICAgICAgb25DcmVhdGU6IHJlZ2lzdGVyVGFza0RlZmluaXRpb24sXG4gICAgICBvblVwZGF0ZTogcmVnaXN0ZXJUYXNrRGVmaW5pdGlvbixcbiAgICAgIG9uRGVsZXRlOiBkZXJlZ2lzdGVyVGFza0RlZmluaXRpb24sXG4gICAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TdGF0ZW1lbnRzKFtcbiAgICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgICAgYWN0aW9uczogWydlY3M6UmVnaXN0ZXJUYXNrRGVmaW5pdGlvbicsICdlY3M6RGVyZWdpc3RlclRhc2tEZWZpbml0aW9uJ10sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICAgIGFjdGlvbnM6IFsnaWFtOlBhc3NSb2xlJ10sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbdGhpcy5leGVjdXRpb25Sb2xlLnJvbGVBcm5dLFxuICAgICAgICB9KSxcbiAgICAgIF0pLFxuICAgIH0pO1xuXG4gICAgdGhpcy50YXNrRGVmaW5pdGlvbkFybiA9IHRhc2tEZWZpbml0aW9uLmdldFJlc3BvbnNlRmllbGQoJ3Rhc2tEZWZpbml0aW9uLnRhc2tEZWZpbml0aW9uQXJuJyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHBvbGljeSBzdGF0ZW1lbnQgdG8gdGhlIHRhc2sgZXhlY3V0aW9uIElBTSByb2xlLlxuICAgKi9cbiAgcHVibGljIGFkZFRvRXhlY3V0aW9uUm9sZVBvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IHZvaWQge1xuICAgIHRoaXMuZXhlY3V0aW9uUm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpO1xuICB9XG59Il19