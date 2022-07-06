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
        this.executionRole = new aws_iam_1.Role(this, 'ExecutionRole', {
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
        const taskDefinition = new custom_resources_1.AwsCustomResource(this, 'DummyTaskDefinition', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtbXktdGFzay1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2R1bW15LXRhc2stZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBbUU7QUFDbkUsaURBQWtEO0FBQ2xELGlEQUE0RztBQUM1RyxtRUFNc0M7QUFDdEMsMkNBQXVDO0FBdUN2QyxNQUFhLG1CQUFvQixTQUFRLHNCQUFTO0lBYWhELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBK0I7UUFDdkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksd0JBQVUsQ0FBQyxxQkFBTyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDbkQsU0FBUyxFQUFFLElBQUksMEJBQWdCLENBQUMseUJBQXlCLENBQUM7WUFDMUQsZUFBZSxFQUFFLENBQUMsdUJBQWEsQ0FBQyx3QkFBd0IsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1NBQzNHLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUM3QyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLElBQUksZ0JBQWdCLENBQUM7UUFDN0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxJQUFJLEVBQUUsQ0FBQztRQUUvQyxNQUFNLHNCQUFzQixHQUFlO1lBQ3pDLE9BQU8sRUFBRSxLQUFLO1lBQ2QsTUFBTSxFQUFFLHdCQUF3QjtZQUNoQyxVQUFVLEVBQUU7Z0JBQ1YsdUJBQXVCLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ3BDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPO2dCQUM1QyxXQUFXLEVBQUUscUJBQVcsQ0FBQyxPQUFPO2dCQUNoQyxHQUFHLEVBQUUsS0FBSztnQkFDVixNQUFNLEVBQUUsS0FBSztnQkFDYixvQkFBb0IsRUFBRTtvQkFDcEI7d0JBQ0UsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhO3dCQUN4QixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7d0JBQ2xCLFlBQVksRUFBRTs0QkFDWjtnQ0FDRSxRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWE7Z0NBQzVCLFFBQVEsRUFBRSxLQUFLO2dDQUNmLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTs2QkFDbEM7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsSUFBSSxFQUFFLGtCQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQzthQUMxRDtZQUNELGtCQUFrQixFQUFFLHFDQUFrQixDQUFDLFlBQVksQ0FBQyxrQ0FBa0MsQ0FBQztTQUN4RixDQUFDO1FBRUYsTUFBTSx3QkFBd0IsR0FBZTtZQUMzQyxPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRSwwQkFBMEI7WUFDbEMsVUFBVSxFQUFFO2dCQUNWLGNBQWMsRUFBRSxJQUFJLDhDQUEyQixFQUFFO2FBQ2xEO1NBQ0YsQ0FBQztRQUVGLE1BQU0sY0FBYyxHQUFHLElBQUksb0NBQWlCLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ3hFLFlBQVksRUFBRSw2QkFBNkI7WUFDM0MsUUFBUSxFQUFFLHNCQUFzQjtZQUNoQyxRQUFRLEVBQUUsc0JBQXNCO1lBQ2hDLFFBQVEsRUFBRSx3QkFBd0I7WUFDbEMsTUFBTSxFQUFFLDBDQUF1QixDQUFDLGNBQWMsQ0FBQztnQkFDN0MsSUFBSSx5QkFBZSxDQUFDO29CQUNsQixNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO29CQUNwQixPQUFPLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSw4QkFBOEIsQ0FBQztvQkFDdkUsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO2lCQUNqQixDQUFDO2dCQUNGLElBQUkseUJBQWUsQ0FBQztvQkFDbEIsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztvQkFDcEIsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO29CQUN6QixTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztpQkFDeEMsQ0FBQzthQUNILENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsY0FBYyxDQUFDLGdCQUFnQixDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVEOztPQUVHO0lBQ0ksd0JBQXdCLENBQUMsU0FBMEI7UUFDeEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyRCxDQUFDO0NBQ0Y7QUEzRkQsa0RBMkZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVRhZ2dhYmxlLCBUYWdNYW5hZ2VyLCBUYWdUeXBlLCBMYXp5IH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgTmV0d29ya01vZGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IFJvbGUsIFNlcnZpY2VQcmluY2lwYWwsIE1hbmFnZWRQb2xpY3ksIFBvbGljeVN0YXRlbWVudCwgRWZmZWN0LCBJUm9sZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHtcbiAgQXdzQ3VzdG9tUmVzb3VyY2UsXG4gIEF3c0N1c3RvbVJlc291cmNlUG9saWN5LFxuICBBd3NTZGtDYWxsLFxuICBQaHlzaWNhbFJlc291cmNlSWQsXG4gIFBoeXNpY2FsUmVzb3VyY2VJZFJlZmVyZW5jZSxcbn0gZnJvbSAnYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBJRHVtbXlUYXNrRGVmaW5pdGlvbiB7XG4gIHJlYWRvbmx5IGV4ZWN1dGlvblJvbGU6IElSb2xlO1xuXG4gIHJlYWRvbmx5IGZhbWlseTogc3RyaW5nO1xuXG4gIHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uQXJuOiBzdHJpbmc7XG5cbiAgcmVhZG9ubHkgY29udGFpbmVyTmFtZTogc3RyaW5nO1xuXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ6IG51bWJlcjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRHVtbXlUYXNrRGVmaW5pdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIGEgZmFtaWx5IHRoYXQgdGhpcyB0YXNrIGRlZmluaXRpb24gaXMgcmVnaXN0ZXJlZCB0by4gQSBmYW1pbHkgZ3JvdXBzIG11bHRpcGxlIHZlcnNpb25zIG9mIGEgdGFzayBkZWZpbml0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIG5hbWUuXG4gICAqL1xuICByZWFkb25seSBmYW1pbHk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBpbWFnZSB1c2VkIHRvIHN0YXJ0IGEgY29udGFpbmVyLlxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2U6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgYHNhbXBsZS13ZWJzaXRlYFxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQGRlZmF1bHQgODBcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBEdW1teVRhc2tEZWZpbml0aW9uIGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSUR1bW15VGFza0RlZmluaXRpb24sIElUYWdnYWJsZSB7XG4gIHB1YmxpYyByZWFkb25seSBleGVjdXRpb25Sb2xlOiBJUm9sZTtcblxuICBwdWJsaWMgcmVhZG9ubHkgZmFtaWx5OiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uQXJuOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNvbnRhaW5lck5hbWU6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgY29udGFpbmVyUG9ydDogbnVtYmVyO1xuXG4gIHB1YmxpYyByZWFkb25seSB0YWdzOiBUYWdNYW5hZ2VyO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBEdW1teVRhc2tEZWZpbml0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy50YWdzID0gbmV3IFRhZ01hbmFnZXIoVGFnVHlwZS5TVEFOREFSRCwgJ1RhZ01hbmFnZXInKTtcblxuICAgIHRoaXMuZXhlY3V0aW9uUm9sZSA9IG5ldyBSb2xlKHRoaXMsICdFeGVjdXRpb25Sb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW01hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQW1hem9uRUNTVGFza0V4ZWN1dGlvblJvbGVQb2xpY3knKV0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmZhbWlseSA9IHByb3BzLmZhbWlseSA/PyB0aGlzLm5vZGUuYWRkcjtcbiAgICB0aGlzLmNvbnRhaW5lck5hbWUgPSBwcm9wcy5jb250YWluZXJOYW1lID8/ICdzYW1wbGUtd2Vic2l0ZSc7XG4gICAgdGhpcy5jb250YWluZXJQb3J0ID0gcHJvcHMuY29udGFpbmVyUG9ydCA/PyA4MDtcblxuICAgIGNvbnN0IHJlZ2lzdGVyVGFza0RlZmluaXRpb246IEF3c1Nka0NhbGwgPSB7XG4gICAgICBzZXJ2aWNlOiAnRUNTJyxcbiAgICAgIGFjdGlvbjogJ3JlZ2lzdGVyVGFza0RlZmluaXRpb24nLFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICByZXF1aXJlc0NvbXBhdGliaWxpdGllczogWydGQVJHQVRFJ10sXG4gICAgICAgIGZhbWlseTogdGhpcy5mYW1pbHksXG4gICAgICAgIGV4ZWN1dGlvblJvbGVBcm46IHRoaXMuZXhlY3V0aW9uUm9sZS5yb2xlQXJuLFxuICAgICAgICBuZXR3b3JrTW9kZTogTmV0d29ya01vZGUuQVdTX1ZQQyxcbiAgICAgICAgY3B1OiAnMjU2JyxcbiAgICAgICAgbWVtb3J5OiAnNTEyJyxcbiAgICAgICAgY29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLmNvbnRhaW5lck5hbWUsXG4gICAgICAgICAgICBpbWFnZTogcHJvcHMuaW1hZ2UsXG4gICAgICAgICAgICBwb3J0TWFwcGluZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGhvc3RQb3J0OiB0aGlzLmNvbnRhaW5lclBvcnQsXG4gICAgICAgICAgICAgICAgcHJvdG9jb2w6ICd0Y3AnLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IHRoaXMuY29udGFpbmVyUG9ydCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGFnczogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnRhZ3MucmVuZGVyVGFncygpIH0pLFxuICAgICAgfSxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZSgndGFza0RlZmluaXRpb24udGFza0RlZmluaXRpb25Bcm4nKSxcbiAgICB9O1xuXG4gICAgY29uc3QgZGVyZWdpc3RlclRhc2tEZWZpbml0aW9uOiBBd3NTZGtDYWxsID0ge1xuICAgICAgc2VydmljZTogJ0VDUycsXG4gICAgICBhY3Rpb246ICdkZXJlZ2lzdGVyVGFza0RlZmluaXRpb24nLFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICB0YXNrRGVmaW5pdGlvbjogbmV3IFBoeXNpY2FsUmVzb3VyY2VJZFJlZmVyZW5jZSgpLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgQXdzQ3VzdG9tUmVzb3VyY2UodGhpcywgJ0R1bW15VGFza0RlZmluaXRpb24nLCB7XG4gICAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206OkR1bW15VGFza0RlZmluaXRpb24nLFxuICAgICAgb25DcmVhdGU6IHJlZ2lzdGVyVGFza0RlZmluaXRpb24sXG4gICAgICBvblVwZGF0ZTogcmVnaXN0ZXJUYXNrRGVmaW5pdGlvbixcbiAgICAgIG9uRGVsZXRlOiBkZXJlZ2lzdGVyVGFza0RlZmluaXRpb24sXG4gICAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TdGF0ZW1lbnRzKFtcbiAgICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgICAgYWN0aW9uczogWydlY3M6UmVnaXN0ZXJUYXNrRGVmaW5pdGlvbicsICdlY3M6RGVyZWdpc3RlclRhc2tEZWZpbml0aW9uJ10sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICAgIGFjdGlvbnM6IFsnaWFtOlBhc3NSb2xlJ10sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbdGhpcy5leGVjdXRpb25Sb2xlLnJvbGVBcm5dLFxuICAgICAgICB9KSxcbiAgICAgIF0pLFxuICAgIH0pO1xuXG4gICAgdGhpcy50YXNrRGVmaW5pdGlvbkFybiA9IHRhc2tEZWZpbml0aW9uLmdldFJlc3BvbnNlRmllbGQoJ3Rhc2tEZWZpbml0aW9uLnRhc2tEZWZpbml0aW9uQXJuJyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHBvbGljeSBzdGF0ZW1lbnQgdG8gdGhlIHRhc2sgZXhlY3V0aW9uIElBTSByb2xlLlxuICAgKi9cbiAgcHVibGljIGFkZFRvRXhlY3V0aW9uUm9sZVBvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IHZvaWQge1xuICAgIHRoaXMuZXhlY3V0aW9uUm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpO1xuICB9XG59Il19