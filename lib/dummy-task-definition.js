"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyTaskDefinition = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const constructs_1 = require("constructs");
class DummyTaskDefinition extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _b, _c, _d;
        super(scope, id);
        this.executionRole = new aws_iam_1.Role(this, `${id}-ER`, {
            assumedBy: new aws_iam_1.ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')],
        });
        const serviceToken = aws_cdk_lib_1.CustomResourceProvider.getOrCreate(this, `${id}-DummyToken`, {
            codeDirectory: path.join(__dirname, 'lambdas', 'dummy-task-definition'),
            runtime: aws_cdk_lib_1.CustomResourceProviderRuntime.NODEJS_12_X,
            policyStatements: [
                {
                    Effect: aws_iam_1.Effect.ALLOW,
                    Action: ['ecs:RegisterTaskDefinition', 'ecs:DeregisterTaskDefinition'],
                    Resource: '*',
                },
                {
                    Effect: aws_iam_1.Effect.ALLOW,
                    Action: ['iam:PassRole'],
                    Resource: this.executionRole.roleArn,
                },
            ],
        });
        this.family = (_b = props.family) !== null && _b !== void 0 ? _b : this.node.addr;
        this.containerName = (_c = props.containerName) !== null && _c !== void 0 ? _c : 'sample-website';
        this.containerPort = (_d = props.containerPort) !== null && _d !== void 0 ? _d : 80;
        const taskDefinition = new aws_cdk_lib_1.CustomResource(this, `${id}-CRTask`, {
            serviceToken,
            resourceType: 'Custom::DummyTaskDefinition',
            properties: {
                Family: this.family,
                Image: props.image,
                ExecutionRoleArn: this.executionRole.roleArn,
                NetworkMode: aws_ecs_1.NetworkMode.AWS_VPC,
                ContainerName: this.containerName,
                ContainerPort: this.containerPort,
            },
        });
        this.taskDefinitionArn = taskDefinition.ref;
    }
    /**
     * Adds a policy statement to the task execution IAM role.
     */
    addToExecutionRolePolicy(statement) {
        this.executionRole.addToPrincipalPolicy(statement);
    }
}
exports.DummyTaskDefinition = DummyTaskDefinition;
_a = JSII_RTTI_SYMBOL_1;
DummyTaskDefinition[_a] = { fqn: "@linz/cdk-blue-green-container-deployment.DummyTaskDefinition", version: "1.48.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtbXktdGFzay1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2R1bW15LXRhc2stZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZCQUE2QjtBQUU3QixpREFBa0Q7QUFDbEQsaURBQTRHO0FBQzVHLDZDQUFvRztBQUNwRywyQ0FBdUM7QUF1Q3ZDLE1BQWEsbUJBQW9CLFNBQVEsc0JBQVM7SUFXaEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUErQjs7UUFDdkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO1lBQzlDLFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHlCQUF5QixDQUFDO1lBQzFELGVBQWUsRUFBRSxDQUFDLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUMzRyxDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxvQ0FBc0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUU7WUFDaEYsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsQ0FBQztZQUN2RSxPQUFPLEVBQUUsMkNBQTZCLENBQUMsV0FBVztZQUNsRCxnQkFBZ0IsRUFBRTtnQkFDaEI7b0JBQ0UsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztvQkFDcEIsTUFBTSxFQUFFLENBQUMsNEJBQTRCLEVBQUUsOEJBQThCLENBQUM7b0JBQ3RFLFFBQVEsRUFBRSxHQUFHO2lCQUNkO2dCQUNEO29CQUNFLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7b0JBQ3BCLE1BQU0sRUFBRSxDQUFDLGNBQWMsQ0FBQztvQkFDeEIsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTztpQkFDckM7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLFNBQUcsS0FBSyxDQUFDLE1BQU0sbUNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDN0MsSUFBSSxDQUFDLGFBQWEsU0FBRyxLQUFLLENBQUMsYUFBYSxtQ0FBSSxnQkFBZ0IsQ0FBQztRQUM3RCxJQUFJLENBQUMsYUFBYSxTQUFHLEtBQUssQ0FBQyxhQUFhLG1DQUFJLEVBQUUsQ0FBQztRQUUvQyxNQUFNLGNBQWMsR0FBRyxJQUFJLDRCQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUU7WUFDOUQsWUFBWTtZQUNaLFlBQVksRUFBRSw2QkFBNkI7WUFDM0MsVUFBVSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO2dCQUNsQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU87Z0JBQzVDLFdBQVcsRUFBRSxxQkFBVyxDQUFDLE9BQU87Z0JBQ2hDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtnQkFDakMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO2FBQ2xDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUM7SUFDOUMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksd0JBQXdCLENBQUMsU0FBMEI7UUFDeEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyRCxDQUFDOztBQTdESCxrREE4REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgeyBOZXR3b3JrTW9kZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuaW1wb3J0IHsgUm9sZSwgU2VydmljZVByaW5jaXBhbCwgTWFuYWdlZFBvbGljeSwgUG9saWN5U3RhdGVtZW50LCBFZmZlY3QsIElSb2xlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZSwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlciwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBJRHVtbXlUYXNrRGVmaW5pdGlvbiB7XG4gIHJlYWRvbmx5IGV4ZWN1dGlvblJvbGU6IElSb2xlO1xuXG4gIHJlYWRvbmx5IGZhbWlseTogc3RyaW5nO1xuXG4gIHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uQXJuOiBzdHJpbmc7XG5cbiAgcmVhZG9ubHkgY29udGFpbmVyTmFtZTogc3RyaW5nO1xuXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ6IG51bWJlcjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRHVtbXlUYXNrRGVmaW5pdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIGEgZmFtaWx5IHRoYXQgdGhpcyB0YXNrIGRlZmluaXRpb24gaXMgcmVnaXN0ZXJlZCB0by4gQSBmYW1pbHkgZ3JvdXBzIG11bHRpcGxlIHZlcnNpb25zIG9mIGEgdGFzayBkZWZpbml0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIG5hbWUuXG4gICAqL1xuICByZWFkb25seSBmYW1pbHk/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBpbWFnZSB1c2VkIHRvIHN0YXJ0IGEgY29udGFpbmVyLlxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2U6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgYHNhbXBsZS13ZWJzaXRlYFxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQGRlZmF1bHQgODBcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBEdW1teVRhc2tEZWZpbml0aW9uIGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSUR1bW15VGFza0RlZmluaXRpb24ge1xuICBwdWJsaWMgcmVhZG9ubHkgZXhlY3V0aW9uUm9sZTogSVJvbGU7XG5cbiAgcHVibGljIHJlYWRvbmx5IGZhbWlseTogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSB0YXNrRGVmaW5pdGlvbkFybjogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBjb250YWluZXJOYW1lOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRHVtbXlUYXNrRGVmaW5pdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuZXhlY3V0aW9uUm9sZSA9IG5ldyBSb2xlKHRoaXMsIGAke2lkfS1FUmAsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnc2VydmljZS1yb2xlL0FtYXpvbkVDU1Rhc2tFeGVjdXRpb25Sb2xlUG9saWN5JyldLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZVRva2VuID0gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZSh0aGlzLCBgJHtpZH0tRHVtbXlUb2tlbmAsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICdsYW1iZGFzJywgJ2R1bW15LXRhc2stZGVmaW5pdGlvbicpLFxuICAgICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzEyX1gsXG4gICAgICBwb2xpY3lTdGF0ZW1lbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBFZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgICAgICBBY3Rpb246IFsnZWNzOlJlZ2lzdGVyVGFza0RlZmluaXRpb24nLCAnZWNzOkRlcmVnaXN0ZXJUYXNrRGVmaW5pdGlvbiddLFxuICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBFZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgICAgICBBY3Rpb246IFsnaWFtOlBhc3NSb2xlJ10sXG4gICAgICAgICAgUmVzb3VyY2U6IHRoaXMuZXhlY3V0aW9uUm9sZS5yb2xlQXJuLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMuZmFtaWx5ID0gcHJvcHMuZmFtaWx5ID8/IHRoaXMubm9kZS5hZGRyO1xuICAgIHRoaXMuY29udGFpbmVyTmFtZSA9IHByb3BzLmNvbnRhaW5lck5hbWUgPz8gJ3NhbXBsZS13ZWJzaXRlJztcbiAgICB0aGlzLmNvbnRhaW5lclBvcnQgPSBwcm9wcy5jb250YWluZXJQb3J0ID8/IDgwO1xuXG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgYCR7aWR9LUNSVGFza2AsIHtcbiAgICAgIHNlcnZpY2VUb2tlbixcbiAgICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6RHVtbXlUYXNrRGVmaW5pdGlvbicsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIEZhbWlseTogdGhpcy5mYW1pbHksXG4gICAgICAgIEltYWdlOiBwcm9wcy5pbWFnZSxcbiAgICAgICAgRXhlY3V0aW9uUm9sZUFybjogdGhpcy5leGVjdXRpb25Sb2xlLnJvbGVBcm4sXG4gICAgICAgIE5ldHdvcmtNb2RlOiBOZXR3b3JrTW9kZS5BV1NfVlBDLFxuICAgICAgICBDb250YWluZXJOYW1lOiB0aGlzLmNvbnRhaW5lck5hbWUsXG4gICAgICAgIENvbnRhaW5lclBvcnQ6IHRoaXMuY29udGFpbmVyUG9ydCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnRhc2tEZWZpbml0aW9uQXJuID0gdGFza0RlZmluaXRpb24ucmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBwb2xpY3kgc3RhdGVtZW50IHRvIHRoZSB0YXNrIGV4ZWN1dGlvbiBJQU0gcm9sZS5cbiAgICovXG4gIHB1YmxpYyBhZGRUb0V4ZWN1dGlvblJvbGVQb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiB2b2lkIHtcbiAgICB0aGlzLmV4ZWN1dGlvblJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KTtcbiAgfVxufVxuIl19