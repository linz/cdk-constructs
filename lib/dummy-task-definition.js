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
        this.requiresCompatibilities = props.requiresCompatibilities ?? ['FARGATE'];
        const registerTaskDefinition = {
            service: 'ECS',
            action: 'registerTaskDefinition',
            parameters: {
                requiresCompatibilities: this.requiresCompatibilities,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtbXktdGFzay1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2R1bW15LXRhc2stZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBbUU7QUFDbkUsaURBQWtEO0FBQ2xELGlEQUE0RztBQUM1RyxtRUFNc0M7QUFDdEMsMkNBQXVDO0FBMkN2QyxNQUFhLG1CQUFvQixTQUFRLHNCQUFTO0lBZWhELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBK0I7UUFDdkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksd0JBQVUsQ0FBQyxxQkFBTyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO1lBQzlDLFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHlCQUF5QixDQUFDO1lBQzFELGVBQWUsRUFBRSxDQUFDLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUMzRyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDN0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxJQUFJLGdCQUFnQixDQUFDO1FBQzdELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBRTNFLE1BQU0sc0JBQXNCLEdBQWU7WUFDekMsT0FBTyxFQUFFLEtBQUs7WUFDZCxNQUFNLEVBQUUsd0JBQXdCO1lBQ2hDLFVBQVUsRUFBRTtnQkFDVix1QkFBdUIsRUFBRSxJQUFJLENBQUMsdUJBQXVCO2dCQUNyRCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLGdCQUFnQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTztnQkFDNUMsV0FBVyxFQUFFLHFCQUFXLENBQUMsT0FBTztnQkFDaEMsR0FBRyxFQUFFLEtBQUs7Z0JBQ1YsTUFBTSxFQUFFLEtBQUs7Z0JBQ2Isb0JBQW9CLEVBQUU7b0JBQ3BCO3dCQUNFLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYTt3QkFDeEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO3dCQUNsQixZQUFZLEVBQUU7NEJBQ1o7Z0NBQ0UsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhO2dDQUM1QixRQUFRLEVBQUUsS0FBSztnQ0FDZixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7NkJBQ2xDO3lCQUNGO3FCQUNGO2lCQUNGO2dCQUNELElBQUksRUFBRSxrQkFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUM7YUFDMUQ7WUFDRCxrQkFBa0IsRUFBRSxxQ0FBa0IsQ0FBQyxZQUFZLENBQUMsa0NBQWtDLENBQUM7U0FDeEYsQ0FBQztRQUVGLE1BQU0sd0JBQXdCLEdBQWU7WUFDM0MsT0FBTyxFQUFFLEtBQUs7WUFDZCxNQUFNLEVBQUUsMEJBQTBCO1lBQ2xDLFVBQVUsRUFBRTtnQkFDVixjQUFjLEVBQUUsSUFBSSw4Q0FBMkIsRUFBRTthQUNsRDtTQUNGLENBQUM7UUFFRixNQUFNLGNBQWMsR0FBRyxJQUFJLG9DQUFpQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFO1lBQ2pFLFlBQVksRUFBRSw2QkFBNkI7WUFDM0MsUUFBUSxFQUFFLHNCQUFzQjtZQUNoQyxRQUFRLEVBQUUsc0JBQXNCO1lBQ2hDLFFBQVEsRUFBRSx3QkFBd0I7WUFDbEMsTUFBTSxFQUFFLDBDQUF1QixDQUFDLGNBQWMsQ0FBQztnQkFDN0MsSUFBSSx5QkFBZSxDQUFDO29CQUNsQixNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO29CQUNwQixPQUFPLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSw4QkFBOEIsQ0FBQztvQkFDdkUsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO2lCQUNqQixDQUFDO2dCQUNGLElBQUkseUJBQWUsQ0FBQztvQkFDbEIsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztvQkFDcEIsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO29CQUN6QixTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztpQkFDeEMsQ0FBQzthQUNILENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsY0FBYyxDQUFDLGdCQUFnQixDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVEOztPQUVHO0lBQ0ksd0JBQXdCLENBQUMsU0FBMEI7UUFDeEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyRCxDQUFDO0NBRUY7QUEvRkQsa0RBK0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVRhZ2dhYmxlLCBUYWdNYW5hZ2VyLCBUYWdUeXBlLCBMYXp5IH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgTmV0d29ya01vZGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IFJvbGUsIFNlcnZpY2VQcmluY2lwYWwsIE1hbmFnZWRQb2xpY3ksIFBvbGljeVN0YXRlbWVudCwgRWZmZWN0LCBJUm9sZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHtcbiAgQXdzQ3VzdG9tUmVzb3VyY2UsXG4gIEF3c0N1c3RvbVJlc291cmNlUG9saWN5LFxuICBBd3NTZGtDYWxsLFxuICBQaHlzaWNhbFJlc291cmNlSWQsXG4gIFBoeXNpY2FsUmVzb3VyY2VJZFJlZmVyZW5jZSxcbn0gZnJvbSAnYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBJRHVtbXlUYXNrRGVmaW5pdGlvbiB7XG4gIHJlYWRvbmx5IGV4ZWN1dGlvblJvbGU6IElSb2xlO1xuXG4gIHJlYWRvbmx5IGZhbWlseTogc3RyaW5nO1xuXG4gIHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uQXJuOiBzdHJpbmc7XG5cbiAgcmVhZG9ubHkgY29udGFpbmVyTmFtZTogc3RyaW5nO1xuXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ6IG51bWJlcjtcblxuICByZWFkb25seSByZXF1aXJlc0NvbXBhdGliaWxpdGllczogc3RyaW5nW107XG59XG5leHBvcnQgaW50ZXJmYWNlIER1bW15VGFza0RlZmluaXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiBhIGZhbWlseSB0aGF0IHRoaXMgdGFzayBkZWZpbml0aW9uIGlzIHJlZ2lzdGVyZWQgdG8uIEEgZmFtaWx5IGdyb3VwcyBtdWx0aXBsZSB2ZXJzaW9ucyBvZiBhIHRhc2sgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBuYW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgZmFtaWx5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaW1hZ2UgdXNlZCB0byBzdGFydCBhIGNvbnRhaW5lci5cbiAgICovXG4gIHJlYWRvbmx5IGltYWdlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IGBzYW1wbGUtd2Vic2l0ZWBcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lck5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBkZWZhdWx0IDgwXG4gICAqL1xuICByZWFkb25seSBjb250YWluZXJQb3J0PzogbnVtYmVyO1xuXG4gIHJlYWRvbmx5IHJlcXVpcmVzQ29tcGF0aWJpbGl0aWVzPzogc3RyaW5nW107XG59XG5cbmV4cG9ydCBjbGFzcyBEdW1teVRhc2tEZWZpbml0aW9uIGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSUR1bW15VGFza0RlZmluaXRpb24sIElUYWdnYWJsZSB7XG4gIHB1YmxpYyByZWFkb25seSBleGVjdXRpb25Sb2xlOiBJUm9sZTtcblxuICBwdWJsaWMgcmVhZG9ubHkgZmFtaWx5OiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uQXJuOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNvbnRhaW5lck5hbWU6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgY29udGFpbmVyUG9ydDogbnVtYmVyO1xuXG4gIHB1YmxpYyByZWFkb25seSB0YWdzOiBUYWdNYW5hZ2VyO1xuXG4gIHB1YmxpYyByZWFkb25seSByZXF1aXJlc0NvbXBhdGliaWxpdGllczogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IER1bW15VGFza0RlZmluaXRpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLnRhZ3MgPSBuZXcgVGFnTWFuYWdlcihUYWdUeXBlLlNUQU5EQVJELCAnVGFnTWFuYWdlcicpO1xuXG4gICAgdGhpcy5leGVjdXRpb25Sb2xlID0gbmV3IFJvbGUodGhpcywgYCR7aWR9LUVSYCwge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW01hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQW1hem9uRUNTVGFza0V4ZWN1dGlvblJvbGVQb2xpY3knKV0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmZhbWlseSA9IHByb3BzLmZhbWlseSA/PyB0aGlzLm5vZGUuYWRkcjtcbiAgICB0aGlzLmNvbnRhaW5lck5hbWUgPSBwcm9wcy5jb250YWluZXJOYW1lID8/ICdzYW1wbGUtd2Vic2l0ZSc7XG4gICAgdGhpcy5jb250YWluZXJQb3J0ID0gcHJvcHMuY29udGFpbmVyUG9ydCA/PyA4MDtcbiAgICB0aGlzLnJlcXVpcmVzQ29tcGF0aWJpbGl0aWVzID0gcHJvcHMucmVxdWlyZXNDb21wYXRpYmlsaXRpZXMgPz8gWydGQVJHQVRFJ11cblxuICAgIGNvbnN0IHJlZ2lzdGVyVGFza0RlZmluaXRpb246IEF3c1Nka0NhbGwgPSB7XG4gICAgICBzZXJ2aWNlOiAnRUNTJyxcbiAgICAgIGFjdGlvbjogJ3JlZ2lzdGVyVGFza0RlZmluaXRpb24nLFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICByZXF1aXJlc0NvbXBhdGliaWxpdGllczogdGhpcy5yZXF1aXJlc0NvbXBhdGliaWxpdGllcyxcbiAgICAgICAgZmFtaWx5OiB0aGlzLmZhbWlseSxcbiAgICAgICAgZXhlY3V0aW9uUm9sZUFybjogdGhpcy5leGVjdXRpb25Sb2xlLnJvbGVBcm4sXG4gICAgICAgIG5ldHdvcmtNb2RlOiBOZXR3b3JrTW9kZS5BV1NfVlBDLFxuICAgICAgICBjcHU6ICcyNTYnLFxuICAgICAgICBtZW1vcnk6ICc1MTInLFxuICAgICAgICBjb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMuY29udGFpbmVyTmFtZSxcbiAgICAgICAgICAgIGltYWdlOiBwcm9wcy5pbWFnZSxcbiAgICAgICAgICAgIHBvcnRNYXBwaW5nczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaG9zdFBvcnQ6IHRoaXMuY29udGFpbmVyUG9ydCxcbiAgICAgICAgICAgICAgICBwcm90b2NvbDogJ3RjcCcsXG4gICAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogdGhpcy5jb250YWluZXJQb3J0LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0YWdzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMudGFncy5yZW5kZXJUYWdzKCkgfSksXG4gICAgICB9LFxuICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQuZnJvbVJlc3BvbnNlKCd0YXNrRGVmaW5pdGlvbi50YXNrRGVmaW5pdGlvbkFybicpLFxuICAgIH07XG5cbiAgICBjb25zdCBkZXJlZ2lzdGVyVGFza0RlZmluaXRpb246IEF3c1Nka0NhbGwgPSB7XG4gICAgICBzZXJ2aWNlOiAnRUNTJyxcbiAgICAgIGFjdGlvbjogJ2RlcmVnaXN0ZXJUYXNrRGVmaW5pdGlvbicsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIHRhc2tEZWZpbml0aW9uOiBuZXcgUGh5c2ljYWxSZXNvdXJjZUlkUmVmZXJlbmNlKCksXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBBd3NDdXN0b21SZXNvdXJjZSh0aGlzLCBgJHtpZH0tQ1JUYXNrYCwge1xuICAgICAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpEdW1teVRhc2tEZWZpbml0aW9uJyxcbiAgICAgIG9uQ3JlYXRlOiByZWdpc3RlclRhc2tEZWZpbml0aW9uLFxuICAgICAgb25VcGRhdGU6IHJlZ2lzdGVyVGFza0RlZmluaXRpb24sXG4gICAgICBvbkRlbGV0ZTogZGVyZWdpc3RlclRhc2tEZWZpbml0aW9uLFxuICAgICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU3RhdGVtZW50cyhbXG4gICAgICAgIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICAgIGFjdGlvbnM6IFsnZWNzOlJlZ2lzdGVyVGFza0RlZmluaXRpb24nLCAnZWNzOkRlcmVnaXN0ZXJUYXNrRGVmaW5pdGlvbiddLFxuICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBlZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgICAgICBhY3Rpb25zOiBbJ2lhbTpQYXNzUm9sZSddLFxuICAgICAgICAgIHJlc291cmNlczogW3RoaXMuZXhlY3V0aW9uUm9sZS5yb2xlQXJuXSxcbiAgICAgICAgfSksXG4gICAgICBdKSxcbiAgICB9KTtcblxuICAgIHRoaXMudGFza0RlZmluaXRpb25Bcm4gPSB0YXNrRGVmaW5pdGlvbi5nZXRSZXNwb25zZUZpZWxkKCd0YXNrRGVmaW5pdGlvbi50YXNrRGVmaW5pdGlvbkFybicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBwb2xpY3kgc3RhdGVtZW50IHRvIHRoZSB0YXNrIGV4ZWN1dGlvbiBJQU0gcm9sZS5cbiAgICovXG4gIHB1YmxpYyBhZGRUb0V4ZWN1dGlvblJvbGVQb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiB2b2lkIHtcbiAgICB0aGlzLmV4ZWN1dGlvblJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KTtcbiAgfVxuXG59Il19