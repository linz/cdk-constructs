"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingStrategy = exports.EcsService = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const constructs_1 = require("constructs");
class EcsService extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _b, _c, _d, _e;
        super(scope, id);
        const { cluster, serviceName, launchType = aws_ecs_1.LaunchType.FARGATE, platformVersion = '1.4.0', desiredCount = 1, prodTargetGroup, taskDefinition, healthCheckGracePeriod, } = props;
        const containerPort = (_b = props.containerPort) !== null && _b !== void 0 ? _b : taskDefinition.containerPort;
        const { vpc } = cluster;
        const securityGroups = props.securityGroups || [
            new aws_ec2_1.SecurityGroup(this, `${id}-SG`, {
                description: `Security group for ${this.node.id} service`,
                vpc,
            }),
        ];
        const serviceToken = aws_cdk_lib_1.CustomResourceProvider.getOrCreate(this, `${id}-BGService`, {
            codeDirectory: path.join(__dirname, 'lambdas', 'ecs-service'),
            runtime: aws_cdk_lib_1.CustomResourceProviderRuntime.NODEJS_12_X,
            policyStatements: [
                {
                    Effect: aws_iam_1.Effect.ALLOW,
                    Action: ['ecs:CreateService', 'ecs:UpdateService', 'ecs:DeleteService', 'ecs:DescribeServices'],
                    Resource: '*',
                },
                {
                    Effect: aws_iam_1.Effect.ALLOW,
                    Action: ['iam:PassRole'],
                    Resource: taskDefinition.executionRole.roleArn,
                },
            ],
        });
        const service = new aws_cdk_lib_1.CustomResource(this, `${id}-ECSCR`, {
            serviceToken,
            resourceType: 'Custom::BlueGreenService',
            properties: {
                Cluster: cluster.clusterName,
                ServiceName: serviceName,
                ContainerName: taskDefinition.containerName,
                TaskDefinition: taskDefinition.taskDefinitionArn,
                LaunchType: launchType,
                PlatformVersion: platformVersion,
                DesiredCount: desiredCount,
                Subnets: vpc.isolatedSubnets.map((sn) => sn.subnetId),
                SecurityGroups: securityGroups.map((sg) => sg.securityGroupId),
                TargetGroupArn: prodTargetGroup.targetGroupArn,
                ContainerPort: containerPort,
                SchedulingStrategy: SchedulingStrategy.REPLICA,
                HealthCheckGracePeriod: healthCheckGracePeriod.toSeconds(),
                DeploymentConfiguration: {
                    maximumPercent: (_c = props.maxHealthyPercent) !== null && _c !== void 0 ? _c : 200,
                    minimumHealthyPercent: (_d = props.minHealthyPercent) !== null && _d !== void 0 ? _d : 50,
                    deploymentCircuitBreaker: props.circuitBreaker
                        ? {
                            enable: true,
                            rollback: (_e = props.circuitBreaker.rollback) !== null && _e !== void 0 ? _e : false,
                        }
                        : undefined,
                },
            },
        });
        service.node.addDependency(prodTargetGroup.loadBalancerAttached);
        this.serviceName = service.getAttString('ServiceName');
        this.clusterName = cluster.clusterName;
        this.connections = new aws_ec2_1.Connections({
            securityGroups,
            defaultPort: aws_ec2_1.Port.tcp(containerPort),
        });
    }
}
exports.EcsService = EcsService;
_a = JSII_RTTI_SYMBOL_1;
EcsService[_a] = { fqn: "@linz/cdk-blue-green-container-deployment.EcsService", version: "1.48.0" };
var SchedulingStrategy;
(function (SchedulingStrategy) {
    SchedulingStrategy["REPLICA"] = "REPLICA";
    SchedulingStrategy["DAEMON"] = "DAEMON";
})(SchedulingStrategy = exports.SchedulingStrategy || (exports.SchedulingStrategy = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZWNzLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2QkFBNkI7QUFDN0IsaURBQXFGO0FBQ3JGLGlEQUFxRjtBQUVyRixpREFBNkM7QUFDN0MsNkNBQThHO0FBRzlHLDJDQUF1QztBQW9EdkMsTUFBYSxVQUFXLFNBQVEsc0JBQVM7SUFLdkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjs7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEVBQ0osT0FBTyxFQUNQLFdBQVcsRUFDWCxVQUFVLEdBQUcsb0JBQVUsQ0FBQyxPQUFPLEVBQy9CLGVBQWUsR0FBRyxPQUFPLEVBQ3pCLFlBQVksR0FBRyxDQUFDLEVBQ2hCLGVBQWUsRUFDZixjQUFjLEVBQ2Qsc0JBQXNCLEdBQ3ZCLEdBQUcsS0FBSyxDQUFDO1FBRVYsTUFBTSxhQUFhLFNBQUcsS0FBSyxDQUFDLGFBQWEsbUNBQUksY0FBYyxDQUFDLGFBQWEsQ0FBQztRQUUxRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRXhCLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLElBQUk7WUFDN0MsSUFBSSx1QkFBYSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO2dCQUNsQyxXQUFXLEVBQUUsc0JBQXNCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVO2dCQUN6RCxHQUFHO2FBQ0osQ0FBQztTQUNILENBQUM7UUFFRixNQUFNLFlBQVksR0FBRyxvQ0FBc0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUU7WUFDL0UsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxhQUFhLENBQUM7WUFDN0QsT0FBTyxFQUFFLDJDQUE2QixDQUFDLFdBQVc7WUFDbEQsZ0JBQWdCLEVBQUU7Z0JBQ2hCO29CQUNFLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7b0JBQ3BCLE1BQU0sRUFBRSxDQUFDLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDO29CQUMvRixRQUFRLEVBQUUsR0FBRztpQkFDZDtnQkFDRDtvQkFDRSxNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO29CQUNwQixNQUFNLEVBQUUsQ0FBQyxjQUFjLENBQUM7b0JBQ3hCLFFBQVEsRUFBRSxjQUFjLENBQUMsYUFBYSxDQUFDLE9BQU87aUJBQy9DO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLDRCQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUU7WUFDdEQsWUFBWTtZQUNaLFlBQVksRUFBRSwwQkFBMEI7WUFDeEMsVUFBVSxFQUFFO2dCQUNWLE9BQU8sRUFBRSxPQUFPLENBQUMsV0FBVztnQkFDNUIsV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLGFBQWEsRUFBRSxjQUFjLENBQUMsYUFBYTtnQkFDM0MsY0FBYyxFQUFFLGNBQWMsQ0FBQyxpQkFBaUI7Z0JBQ2hELFVBQVUsRUFBRSxVQUFVO2dCQUN0QixlQUFlLEVBQUUsZUFBZTtnQkFDaEMsWUFBWSxFQUFFLFlBQVk7Z0JBQzFCLE9BQU8sRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFDckQsY0FBYyxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQzlELGNBQWMsRUFBRSxlQUFlLENBQUMsY0FBYztnQkFDOUMsYUFBYSxFQUFFLGFBQWE7Z0JBQzVCLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLE9BQU87Z0JBQzlDLHNCQUFzQixFQUFFLHNCQUFzQixDQUFDLFNBQVMsRUFBRTtnQkFDMUQsdUJBQXVCLEVBQUU7b0JBQ3ZCLGNBQWMsUUFBRSxLQUFLLENBQUMsaUJBQWlCLG1DQUFJLEdBQUc7b0JBQzlDLHFCQUFxQixRQUFFLEtBQUssQ0FBQyxpQkFBaUIsbUNBQUksRUFBRTtvQkFDcEQsd0JBQXdCLEVBQUUsS0FBSyxDQUFDLGNBQWM7d0JBQzVDLENBQUMsQ0FBQzs0QkFDRSxNQUFNLEVBQUUsSUFBSTs0QkFDWixRQUFRLFFBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLG1DQUFJLEtBQUs7eUJBQ2pEO3dCQUNILENBQUMsQ0FBQyxTQUFTO2lCQUNkO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUVqRSxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBRXZDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxxQkFBVyxDQUFDO1lBQ2pDLGNBQWM7WUFDZCxXQUFXLEVBQUUsY0FBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUM7U0FDckMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7QUF0RkgsZ0NBdUZDOzs7QUFFRCxJQUFZLGtCQUdYO0FBSEQsV0FBWSxrQkFBa0I7SUFDNUIseUNBQW1CLENBQUE7SUFDbkIsdUNBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQUhXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBRzdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IElDb25uZWN0YWJsZSwgQ29ubmVjdGlvbnMsIFNlY3VyaXR5R3JvdXAsIFBvcnQgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCB7IElDbHVzdGVyLCBMYXVuY2hUeXBlLCBEZXBsb3ltZW50Q2lyY3VpdEJyZWFrZXIgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IElUYXJnZXRHcm91cCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyJztcbmltcG9ydCB7IEVmZmVjdCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgRHVyYXRpb24sIEN1c3RvbVJlc291cmNlLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZSB9IGZyb20gJ2F3cy1jZGstbGliJztcblxuaW1wb3J0IHsgRHVtbXlUYXNrRGVmaW5pdGlvbiB9IGZyb20gJy4vZHVtbXktdGFzay1kZWZpbml0aW9uJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElFY3NTZXJ2aWNlIHtcbiAgcmVhZG9ubHkgY2x1c3Rlck5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgc2VydmljZU5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFY3NTZXJ2aWNlUHJvcHMge1xuICByZWFkb25seSBzZWN1cml0eUdyb3Vwcz86IFNlY3VyaXR5R3JvdXBbXTtcbiAgcmVhZG9ubHkgY2x1c3RlcjogSUNsdXN0ZXI7XG4gIHJlYWRvbmx5IHNlcnZpY2VOYW1lOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGxhdW5jaFR5cGU/OiBMYXVuY2hUeXBlO1xuICByZWFkb25seSBwbGF0Zm9ybVZlcnNpb24/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGRlc2lyZWRDb3VudD86IG51bWJlcjtcbiAgcmVhZG9ubHkgY29udGFpbmVyUG9ydD86IG51bWJlcjtcbiAgcmVhZG9ubHkgcHJvZFRhcmdldEdyb3VwOiBJVGFyZ2V0R3JvdXA7XG4gIHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uOiBEdW1teVRhc2tEZWZpbml0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgcGVyaW9kIG9mIHRpbWUsIGluIHNlY29uZHMsIHRoYXQgdGhlIEFtYXpvbiBFQ1Mgc2VydmljZSBzY2hlZHVsZXIgaWdub3JlcyB1bmhlYWx0aHlcbiAgICogRWxhc3RpYyBMb2FkIEJhbGFuY2luZyB0YXJnZXQgaGVhbHRoIGNoZWNrcyBhZnRlciBhIHRhc2sgaGFzIGZpcnN0IHN0YXJ0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZGVmYXVsdHMgdG8gNjAgc2Vjb25kcyBpZiBhdCBsZWFzdCBvbmUgbG9hZCBiYWxhbmNlciBpcyBpbi11c2UgYW5kIGl0IGlzIG5vdCBhbHJlYWR5IHNldFxuICAgKi9cbiAgcmVhZG9ubHkgaGVhbHRoQ2hlY2tHcmFjZVBlcmlvZDogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiB0YXNrcywgc3BlY2lmaWVkIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgQW1hem9uIEVDU1xuICAgKiBzZXJ2aWNlJ3MgRGVzaXJlZENvdW50IHZhbHVlLCB0aGF0IGNhbiBydW4gaW4gYSBzZXJ2aWNlIGR1cmluZyBhXG4gICAqIGRlcGxveW1lbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gMTAwIGlmIGRhZW1vbiwgb3RoZXJ3aXNlIDIwMFxuICAgKi9cbiAgcmVhZG9ubHkgbWF4SGVhbHRoeVBlcmNlbnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBtaW5pbXVtIG51bWJlciBvZiB0YXNrcywgc3BlY2lmaWVkIGFzIGEgcGVyY2VudGFnZSBvZlxuICAgKiB0aGUgQW1hem9uIEVDUyBzZXJ2aWNlJ3MgRGVzaXJlZENvdW50IHZhbHVlLCB0aGF0IG11c3RcbiAgICogY29udGludWUgdG8gcnVuIGFuZCByZW1haW4gaGVhbHRoeSBkdXJpbmcgYSBkZXBsb3ltZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDAgaWYgZGFlbW9uLCBvdGhlcndpc2UgNTBcbiAgICovXG4gIHJlYWRvbmx5IG1pbkhlYWx0aHlQZXJjZW50PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGVuYWJsZSB0aGUgZGVwbG95bWVudCBjaXJjdWl0IGJyZWFrZXIuIElmIHRoaXMgcHJvcGVydHkgaXMgZGVmaW5lZCwgY2lyY3VpdCBicmVha2VyIHdpbGwgYmUgaW1wbGljaXRseVxuICAgKiBlbmFibGVkLlxuICAgKiBAZGVmYXVsdCAtIGRpc2FibGVkXG4gICAqL1xuICByZWFkb25seSBjaXJjdWl0QnJlYWtlcj86IERlcGxveW1lbnRDaXJjdWl0QnJlYWtlcjtcbn1cblxuZXhwb3J0IGNsYXNzIEVjc1NlcnZpY2UgZXh0ZW5kcyBDb25zdHJ1Y3QgaW1wbGVtZW50cyBJQ29ubmVjdGFibGUsIElFY3NTZXJ2aWNlIHtcbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBzZXJ2aWNlTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbnM6IENvbm5lY3Rpb25zO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFY3NTZXJ2aWNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3Qge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHNlcnZpY2VOYW1lLFxuICAgICAgbGF1bmNoVHlwZSA9IExhdW5jaFR5cGUuRkFSR0FURSxcbiAgICAgIHBsYXRmb3JtVmVyc2lvbiA9ICcxLjQuMCcsXG4gICAgICBkZXNpcmVkQ291bnQgPSAxLFxuICAgICAgcHJvZFRhcmdldEdyb3VwLFxuICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICBoZWFsdGhDaGVja0dyYWNlUGVyaW9kLFxuICAgIH0gPSBwcm9wcztcblxuICAgIGNvbnN0IGNvbnRhaW5lclBvcnQgPSBwcm9wcy5jb250YWluZXJQb3J0ID8/IHRhc2tEZWZpbml0aW9uLmNvbnRhaW5lclBvcnQ7XG5cbiAgICBjb25zdCB7IHZwYyB9ID0gY2x1c3RlcjtcblxuICAgIGNvbnN0IHNlY3VyaXR5R3JvdXBzID0gcHJvcHMuc2VjdXJpdHlHcm91cHMgfHwgW1xuICAgICAgbmV3IFNlY3VyaXR5R3JvdXAodGhpcywgYCR7aWR9LVNHYCwge1xuICAgICAgICBkZXNjcmlwdGlvbjogYFNlY3VyaXR5IGdyb3VwIGZvciAke3RoaXMubm9kZS5pZH0gc2VydmljZWAsXG4gICAgICAgIHZwYyxcbiAgICAgIH0pLFxuICAgIF07XG5cbiAgICBjb25zdCBzZXJ2aWNlVG9rZW4gPSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlKHRoaXMsIGAke2lkfS1CR1NlcnZpY2VgLCB7XG4gICAgICBjb2RlRGlyZWN0b3J5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnbGFtYmRhcycsICdlY3Mtc2VydmljZScpLFxuICAgICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzEyX1gsXG4gICAgICBwb2xpY3lTdGF0ZW1lbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBFZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgICAgICBBY3Rpb246IFsnZWNzOkNyZWF0ZVNlcnZpY2UnLCAnZWNzOlVwZGF0ZVNlcnZpY2UnLCAnZWNzOkRlbGV0ZVNlcnZpY2UnLCAnZWNzOkRlc2NyaWJlU2VydmljZXMnXSxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgICAgQWN0aW9uOiBbJ2lhbTpQYXNzUm9sZSddLFxuICAgICAgICAgIFJlc291cmNlOiB0YXNrRGVmaW5pdGlvbi5leGVjdXRpb25Sb2xlLnJvbGVBcm4sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZSA9IG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCBgJHtpZH0tRUNTQ1JgLCB7XG4gICAgICBzZXJ2aWNlVG9rZW4sXG4gICAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206OkJsdWVHcmVlblNlcnZpY2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBDbHVzdGVyOiBjbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgICBTZXJ2aWNlTmFtZTogc2VydmljZU5hbWUsXG4gICAgICAgIENvbnRhaW5lck5hbWU6IHRhc2tEZWZpbml0aW9uLmNvbnRhaW5lck5hbWUsXG4gICAgICAgIFRhc2tEZWZpbml0aW9uOiB0YXNrRGVmaW5pdGlvbi50YXNrRGVmaW5pdGlvbkFybixcbiAgICAgICAgTGF1bmNoVHlwZTogbGF1bmNoVHlwZSxcbiAgICAgICAgUGxhdGZvcm1WZXJzaW9uOiBwbGF0Zm9ybVZlcnNpb24sXG4gICAgICAgIERlc2lyZWRDb3VudDogZGVzaXJlZENvdW50LFxuICAgICAgICBTdWJuZXRzOiB2cGMuaXNvbGF0ZWRTdWJuZXRzLm1hcCgoc24pID0+IHNuLnN1Ym5ldElkKSxcbiAgICAgICAgU2VjdXJpdHlHcm91cHM6IHNlY3VyaXR5R3JvdXBzLm1hcCgoc2cpID0+IHNnLnNlY3VyaXR5R3JvdXBJZCksXG4gICAgICAgIFRhcmdldEdyb3VwQXJuOiBwcm9kVGFyZ2V0R3JvdXAudGFyZ2V0R3JvdXBBcm4sXG4gICAgICAgIENvbnRhaW5lclBvcnQ6IGNvbnRhaW5lclBvcnQsXG4gICAgICAgIFNjaGVkdWxpbmdTdHJhdGVneTogU2NoZWR1bGluZ1N0cmF0ZWd5LlJFUExJQ0EsXG4gICAgICAgIEhlYWx0aENoZWNrR3JhY2VQZXJpb2Q6IGhlYWx0aENoZWNrR3JhY2VQZXJpb2QudG9TZWNvbmRzKCksXG4gICAgICAgIERlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgbWF4aW11bVBlcmNlbnQ6IHByb3BzLm1heEhlYWx0aHlQZXJjZW50ID8/IDIwMCxcbiAgICAgICAgICBtaW5pbXVtSGVhbHRoeVBlcmNlbnQ6IHByb3BzLm1pbkhlYWx0aHlQZXJjZW50ID8/IDUwLFxuICAgICAgICAgIGRlcGxveW1lbnRDaXJjdWl0QnJlYWtlcjogcHJvcHMuY2lyY3VpdEJyZWFrZXJcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICByb2xsYmFjazogcHJvcHMuY2lyY3VpdEJyZWFrZXIucm9sbGJhY2sgPz8gZmFsc2UsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHNlcnZpY2Uubm9kZS5hZGREZXBlbmRlbmN5KHByb2RUYXJnZXRHcm91cC5sb2FkQmFsYW5jZXJBdHRhY2hlZCk7XG5cbiAgICB0aGlzLnNlcnZpY2VOYW1lID0gc2VydmljZS5nZXRBdHRTdHJpbmcoJ1NlcnZpY2VOYW1lJyk7XG4gICAgdGhpcy5jbHVzdGVyTmFtZSA9IGNsdXN0ZXIuY2x1c3Rlck5hbWU7XG5cbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25zKHtcbiAgICAgIHNlY3VyaXR5R3JvdXBzLFxuICAgICAgZGVmYXVsdFBvcnQ6IFBvcnQudGNwKGNvbnRhaW5lclBvcnQpLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBlbnVtIFNjaGVkdWxpbmdTdHJhdGVneSB7XG4gIFJFUExJQ0EgPSAnUkVQTElDQScsXG4gIERBRU1PTiA9ICdEQUVNT04nLFxufVxuIl19