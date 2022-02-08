"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyTaskDefinition = void 0;
const path = require("path");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
class DummyTaskDefinition extends core_1.Construct {
    constructor(scope, id, props) {
        var _a, _b, _c;
        super(scope, id);
        this.executionRole = new aws_iam_1.Role(this, `${id}-ER`, {
            assumedBy: new aws_iam_1.ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')],
        });
        const serviceToken = core_1.CustomResourceProvider.getOrCreate(this, `${id}-DummyToken`, {
            codeDirectory: path.join(__dirname, 'lambdas', 'dummy-task-definition'),
            runtime: core_1.CustomResourceProviderRuntime.NODEJS_12_X,
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
        this.family = (_a = props.family) !== null && _a !== void 0 ? _a : this.node.addr;
        this.containerName = (_b = props.containerName) !== null && _b !== void 0 ? _b : 'sample-website';
        this.containerPort = (_c = props.containerPort) !== null && _c !== void 0 ? _c : 80;
        const taskDefinition = new core_1.CustomResource(this, `${id}-CRTask`, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtbXktdGFzay1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2R1bW15LXRhc2stZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFFN0IsOENBQStDO0FBQy9DLDhDQUF5RztBQUN6Ryx3Q0FBaUg7QUF1Q2pILE1BQWEsbUJBQW9CLFNBQVEsZ0JBQVM7SUFXaEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUErQjs7UUFDdkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO1lBQzlDLFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHlCQUF5QixDQUFDO1lBQzFELGVBQWUsRUFBRSxDQUFDLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUMzRyxDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyw2QkFBc0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUU7WUFDaEYsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsQ0FBQztZQUN2RSxPQUFPLEVBQUUsb0NBQTZCLENBQUMsV0FBVztZQUNsRCxnQkFBZ0IsRUFBRTtnQkFDaEI7b0JBQ0UsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztvQkFDcEIsTUFBTSxFQUFFLENBQUMsNEJBQTRCLEVBQUUsOEJBQThCLENBQUM7b0JBQ3RFLFFBQVEsRUFBRSxHQUFHO2lCQUNkO2dCQUNEO29CQUNFLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7b0JBQ3BCLE1BQU0sRUFBRSxDQUFDLGNBQWMsQ0FBQztvQkFDeEIsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTztpQkFDckM7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLFNBQUcsS0FBSyxDQUFDLE1BQU0sbUNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDN0MsSUFBSSxDQUFDLGFBQWEsU0FBRyxLQUFLLENBQUMsYUFBYSxtQ0FBSSxnQkFBZ0IsQ0FBQztRQUM3RCxJQUFJLENBQUMsYUFBYSxTQUFHLEtBQUssQ0FBQyxhQUFhLG1DQUFJLEVBQUUsQ0FBQztRQUUvQyxNQUFNLGNBQWMsR0FBRyxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUU7WUFDOUQsWUFBWTtZQUNaLFlBQVksRUFBRSw2QkFBNkI7WUFDM0MsVUFBVSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO2dCQUNsQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU87Z0JBQzVDLFdBQVcsRUFBRSxxQkFBVyxDQUFDLE9BQU87Z0JBQ2hDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtnQkFDakMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO2FBQ2xDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUM7SUFDOUMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksd0JBQXdCLENBQUMsU0FBMEI7UUFDeEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyRCxDQUFDO0NBQ0Y7QUE5REQsa0RBOERDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmltcG9ydCB7IE5ldHdvcmtNb2RlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjcyc7XHJcbmltcG9ydCB7IFJvbGUsIFNlcnZpY2VQcmluY2lwYWwsIE1hbmFnZWRQb2xpY3ksIFBvbGljeVN0YXRlbWVudCwgRWZmZWN0LCBJUm9sZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QsIEN1c3RvbVJlc291cmNlLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRHVtbXlUYXNrRGVmaW5pdGlvbiB7XHJcbiAgcmVhZG9ubHkgZXhlY3V0aW9uUm9sZTogSVJvbGU7XHJcblxyXG4gIHJlYWRvbmx5IGZhbWlseTogc3RyaW5nO1xyXG5cclxuICByZWFkb25seSB0YXNrRGVmaW5pdGlvbkFybjogc3RyaW5nO1xyXG5cclxuICByZWFkb25seSBjb250YWluZXJOYW1lOiBzdHJpbmc7XHJcblxyXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ6IG51bWJlcjtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIER1bW15VGFza0RlZmluaXRpb25Qcm9wcyB7XHJcbiAgLyoqXHJcbiAgICogVGhlIG5hbWUgb2YgYSBmYW1pbHkgdGhhdCB0aGlzIHRhc2sgZGVmaW5pdGlvbiBpcyByZWdpc3RlcmVkIHRvLiBBIGZhbWlseSBncm91cHMgbXVsdGlwbGUgdmVyc2lvbnMgb2YgYSB0YXNrIGRlZmluaXRpb24uXHJcbiAgICpcclxuICAgKiBAZGVmYXVsdCAtIEF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIG5hbWUuXHJcbiAgICovXHJcbiAgcmVhZG9ubHkgZmFtaWx5Pzogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgaW1hZ2UgdXNlZCB0byBzdGFydCBhIGNvbnRhaW5lci5cclxuICAgKi9cclxuICByZWFkb25seSBpbWFnZTogc3RyaW5nO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgbmFtZSBvZiB0aGUgY29udGFpbmVyLlxyXG4gICAqXHJcbiAgICogQGRlZmF1bHQgYHNhbXBsZS13ZWJzaXRlYFxyXG4gICAqL1xyXG4gIHJlYWRvbmx5IGNvbnRhaW5lck5hbWU/OiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBkZWZhdWx0IDgwXHJcbiAgICovXHJcbiAgcmVhZG9ubHkgY29udGFpbmVyUG9ydD86IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIER1bW15VGFza0RlZmluaXRpb24gZXh0ZW5kcyBDb25zdHJ1Y3QgaW1wbGVtZW50cyBJRHVtbXlUYXNrRGVmaW5pdGlvbiB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGV4ZWN1dGlvblJvbGU6IElSb2xlO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgZmFtaWx5OiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyByZWFkb25seSB0YXNrRGVmaW5pdGlvbkFybjogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgY29udGFpbmVyTmFtZTogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgY29udGFpbmVyUG9ydDogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRHVtbXlUYXNrRGVmaW5pdGlvblByb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgIHRoaXMuZXhlY3V0aW9uUm9sZSA9IG5ldyBSb2xlKHRoaXMsIGAke2lkfS1FUmAsIHtcclxuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nKSxcclxuICAgICAgbWFuYWdlZFBvbGljaWVzOiBbTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ3NlcnZpY2Utcm9sZS9BbWF6b25FQ1NUYXNrRXhlY3V0aW9uUm9sZVBvbGljeScpXSxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHNlcnZpY2VUb2tlbiA9IEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGUodGhpcywgYCR7aWR9LUR1bW15VG9rZW5gLCB7XHJcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICdsYW1iZGFzJywgJ2R1bW15LXRhc2stZGVmaW5pdGlvbicpLFxyXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTJfWCxcclxuICAgICAgcG9saWN5U3RhdGVtZW50czogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIEVmZmVjdDogRWZmZWN0LkFMTE9XLFxyXG4gICAgICAgICAgQWN0aW9uOiBbJ2VjczpSZWdpc3RlclRhc2tEZWZpbml0aW9uJywgJ2VjczpEZXJlZ2lzdGVyVGFza0RlZmluaXRpb24nXSxcclxuICAgICAgICAgIFJlc291cmNlOiAnKicsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBFZmZlY3Q6IEVmZmVjdC5BTExPVyxcclxuICAgICAgICAgIEFjdGlvbjogWydpYW06UGFzc1JvbGUnXSxcclxuICAgICAgICAgIFJlc291cmNlOiB0aGlzLmV4ZWN1dGlvblJvbGUucm9sZUFybixcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5mYW1pbHkgPSBwcm9wcy5mYW1pbHkgPz8gdGhpcy5ub2RlLmFkZHI7XHJcbiAgICB0aGlzLmNvbnRhaW5lck5hbWUgPSBwcm9wcy5jb250YWluZXJOYW1lID8/ICdzYW1wbGUtd2Vic2l0ZSc7XHJcbiAgICB0aGlzLmNvbnRhaW5lclBvcnQgPSBwcm9wcy5jb250YWluZXJQb3J0ID8/IDgwO1xyXG5cclxuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsIGAke2lkfS1DUlRhc2tgLCB7XHJcbiAgICAgIHNlcnZpY2VUb2tlbixcclxuICAgICAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpEdW1teVRhc2tEZWZpbml0aW9uJyxcclxuICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIEZhbWlseTogdGhpcy5mYW1pbHksXHJcbiAgICAgICAgSW1hZ2U6IHByb3BzLmltYWdlLFxyXG4gICAgICAgIEV4ZWN1dGlvblJvbGVBcm46IHRoaXMuZXhlY3V0aW9uUm9sZS5yb2xlQXJuLFxyXG4gICAgICAgIE5ldHdvcmtNb2RlOiBOZXR3b3JrTW9kZS5BV1NfVlBDLFxyXG4gICAgICAgIENvbnRhaW5lck5hbWU6IHRoaXMuY29udGFpbmVyTmFtZSxcclxuICAgICAgICBDb250YWluZXJQb3J0OiB0aGlzLmNvbnRhaW5lclBvcnQsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnRhc2tEZWZpbml0aW9uQXJuID0gdGFza0RlZmluaXRpb24ucmVmO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkcyBhIHBvbGljeSBzdGF0ZW1lbnQgdG8gdGhlIHRhc2sgZXhlY3V0aW9uIElBTSByb2xlLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBhZGRUb0V4ZWN1dGlvblJvbGVQb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiB2b2lkIHtcclxuICAgIHRoaXMuZXhlY3V0aW9uUm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpO1xyXG4gIH1cclxufVxyXG4iXX0=