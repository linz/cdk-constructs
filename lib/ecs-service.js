"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingStrategy = exports.EcsService = void 0;
const path = require("path");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
class EcsService extends core_1.Construct {
    constructor(scope, id, props) {
        var _a, _b, _c, _d;
        super(scope, id);
        const { cluster, serviceName, launchType = aws_ecs_1.LaunchType.FARGATE, platformVersion = '1.4.0', desiredCount = 1, prodTargetGroup, taskDefinition, healthCheckGracePeriod, } = props;
        const containerPort = (_a = props.containerPort) !== null && _a !== void 0 ? _a : taskDefinition.containerPort;
        const { vpc } = cluster;
        const securityGroups = props.securityGroups || [
            new aws_ec2_1.SecurityGroup(this, `${id}-SG`, {
                description: `Security group for ${this.node.id} service`,
                vpc,
            }),
        ];
        const serviceToken = core_1.CustomResourceProvider.getOrCreate(this, `${id}-BGService`, {
            codeDirectory: path.join(__dirname, 'lambdas', 'ecs-service'),
            runtime: core_1.CustomResourceProviderRuntime.NODEJS_12_X,
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
        const service = new core_1.CustomResource(this, `${id}-ECSCR`, {
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
                    maximumPercent: (_b = props.maxHealthyPercent) !== null && _b !== void 0 ? _b : 200,
                    minimumHealthyPercent: (_c = props.minHealthyPercent) !== null && _c !== void 0 ? _c : 50,
                    deploymentCircuitBreaker: props.circuitBreaker
                        ? {
                            enable: true,
                            rollback: (_d = props.circuitBreaker.rollback) !== null && _d !== void 0 ? _d : false,
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
var SchedulingStrategy;
(function (SchedulingStrategy) {
    SchedulingStrategy["REPLICA"] = "REPLICA";
    SchedulingStrategy["DAEMON"] = "DAEMON";
})(SchedulingStrategy = exports.SchedulingStrategy || (exports.SchedulingStrategy = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZWNzLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLDhDQUFrRjtBQUNsRiw4Q0FBa0Y7QUFFbEYsOENBQTBDO0FBQzFDLHdDQUEySDtBQXNEM0gsTUFBYSxVQUFXLFNBQVEsZ0JBQVM7SUFLdkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjs7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEVBQ0osT0FBTyxFQUNQLFdBQVcsRUFDWCxVQUFVLEdBQUcsb0JBQVUsQ0FBQyxPQUFPLEVBQy9CLGVBQWUsR0FBRyxPQUFPLEVBQ3pCLFlBQVksR0FBRyxDQUFDLEVBQ2hCLGVBQWUsRUFDZixjQUFjLEVBQ2Qsc0JBQXNCLEdBQ3ZCLEdBQUcsS0FBSyxDQUFDO1FBRVYsTUFBTSxhQUFhLFNBQUcsS0FBSyxDQUFDLGFBQWEsbUNBQUksY0FBYyxDQUFDLGFBQWEsQ0FBQztRQUUxRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRXhCLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLElBQUk7WUFDN0MsSUFBSSx1QkFBYSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO2dCQUNsQyxXQUFXLEVBQUUsc0JBQXNCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVO2dCQUN6RCxHQUFHO2FBQ0osQ0FBQztTQUNILENBQUM7UUFFRixNQUFNLFlBQVksR0FBRyw2QkFBc0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUU7WUFDL0UsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxhQUFhLENBQUM7WUFDN0QsT0FBTyxFQUFFLG9DQUE2QixDQUFDLFdBQVc7WUFDbEQsZ0JBQWdCLEVBQUU7Z0JBQ2hCO29CQUNFLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7b0JBQ3BCLE1BQU0sRUFBRSxDQUFDLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDO29CQUMvRixRQUFRLEVBQUUsR0FBRztpQkFDZDtnQkFDRDtvQkFDRSxNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO29CQUNwQixNQUFNLEVBQUUsQ0FBQyxjQUFjLENBQUM7b0JBQ3hCLFFBQVEsRUFBRSxjQUFjLENBQUMsYUFBYSxDQUFDLE9BQU87aUJBQy9DO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUU7WUFDdEQsWUFBWTtZQUNaLFlBQVksRUFBRSwwQkFBMEI7WUFDeEMsVUFBVSxFQUFFO2dCQUNWLE9BQU8sRUFBRSxPQUFPLENBQUMsV0FBVztnQkFDNUIsV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLGFBQWEsRUFBRSxjQUFjLENBQUMsYUFBYTtnQkFDM0MsY0FBYyxFQUFFLGNBQWMsQ0FBQyxpQkFBaUI7Z0JBQ2hELFVBQVUsRUFBRSxVQUFVO2dCQUN0QixlQUFlLEVBQUUsZUFBZTtnQkFDaEMsWUFBWSxFQUFFLFlBQVk7Z0JBQzFCLE9BQU8sRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFDckQsY0FBYyxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQzlELGNBQWMsRUFBRSxlQUFlLENBQUMsY0FBYztnQkFDOUMsYUFBYSxFQUFFLGFBQWE7Z0JBQzVCLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLE9BQU87Z0JBQzlDLHNCQUFzQixFQUFFLHNCQUFzQixDQUFDLFNBQVMsRUFBRTtnQkFDMUQsdUJBQXVCLEVBQUU7b0JBQ3ZCLGNBQWMsUUFBRSxLQUFLLENBQUMsaUJBQWlCLG1DQUFJLEdBQUc7b0JBQzlDLHFCQUFxQixRQUFFLEtBQUssQ0FBQyxpQkFBaUIsbUNBQUksRUFBRTtvQkFDcEQsd0JBQXdCLEVBQUUsS0FBSyxDQUFDLGNBQWM7d0JBQzVDLENBQUMsQ0FBQzs0QkFDRSxNQUFNLEVBQUUsSUFBSTs0QkFDWixRQUFRLFFBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLG1DQUFJLEtBQUs7eUJBQ2pEO3dCQUNILENBQUMsQ0FBQyxTQUFTO2lCQUNkO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUVqRSxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBRXZDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxxQkFBVyxDQUFDO1lBQ2pDLGNBQWM7WUFDZCxXQUFXLEVBQUUsY0FBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUM7U0FDckMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBdkZELGdDQXVGQztBQUVELElBQVksa0JBR1g7QUFIRCxXQUFZLGtCQUFrQjtJQUM1Qix5Q0FBbUIsQ0FBQTtJQUNuQix1Q0FBaUIsQ0FBQTtBQUNuQixDQUFDLEVBSFcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFHN0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgSUNvbm5lY3RhYmxlLCBDb25uZWN0aW9ucywgU2VjdXJpdHlHcm91cCwgUG9ydCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgSUNsdXN0ZXIsIExhdW5jaFR5cGUsIERlcGxveW1lbnRDaXJjdWl0QnJlYWtlciB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3MnO1xuaW1wb3J0IHsgSVRhcmdldEdyb3VwIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0IHsgRWZmZWN0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgQ29uc3RydWN0LCBDdXN0b21SZXNvdXJjZSwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlciwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcblxuaW1wb3J0IHsgRHVtbXlUYXNrRGVmaW5pdGlvbiB9IGZyb20gJy4vZHVtbXktdGFzay1kZWZpbml0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBJRWNzU2VydmljZSB7XG4gIHJlYWRvbmx5IGNsdXN0ZXJOYW1lOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHNlcnZpY2VOYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWNzU2VydmljZVByb3BzIHtcbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cHM/OiBTZWN1cml0eUdyb3VwW107XG4gIHJlYWRvbmx5IGNsdXN0ZXI6IElDbHVzdGVyO1xuICByZWFkb25seSBzZXJ2aWNlTmFtZTogc3RyaW5nO1xuICByZWFkb25seSBsYXVuY2hUeXBlPzogTGF1bmNoVHlwZTtcbiAgcmVhZG9ubHkgcGxhdGZvcm1WZXJzaW9uPzogc3RyaW5nO1xuICByZWFkb25seSBkZXNpcmVkQ291bnQ/OiBudW1iZXI7XG4gIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ/OiBudW1iZXI7XG4gIHJlYWRvbmx5IHByb2RUYXJnZXRHcm91cDogSVRhcmdldEdyb3VwO1xuICByZWFkb25seSB0YXNrRGVmaW5pdGlvbjogRHVtbXlUYXNrRGVmaW5pdGlvbjtcblxuICAvKipcbiAgICogVGhlIHBlcmlvZCBvZiB0aW1lLCBpbiBzZWNvbmRzLCB0aGF0IHRoZSBBbWF6b24gRUNTIHNlcnZpY2Ugc2NoZWR1bGVyIGlnbm9yZXMgdW5oZWFsdGh5XG4gICAqIEVsYXN0aWMgTG9hZCBCYWxhbmNpbmcgdGFyZ2V0IGhlYWx0aCBjaGVja3MgYWZ0ZXIgYSB0YXNrIGhhcyBmaXJzdCBzdGFydGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRlZmF1bHRzIHRvIDYwIHNlY29uZHMgaWYgYXQgbGVhc3Qgb25lIGxvYWQgYmFsYW5jZXIgaXMgaW4tdXNlIGFuZCBpdCBpcyBub3QgYWxyZWFkeSBzZXRcbiAgICovXG4gIHJlYWRvbmx5IGhlYWx0aENoZWNrR3JhY2VQZXJpb2Q6IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgdGFza3MsIHNwZWNpZmllZCBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIEFtYXpvbiBFQ1NcbiAgICogc2VydmljZSdzIERlc2lyZWRDb3VudCB2YWx1ZSwgdGhhdCBjYW4gcnVuIGluIGEgc2VydmljZSBkdXJpbmcgYVxuICAgKiBkZXBsb3ltZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDEwMCBpZiBkYWVtb24sIG90aGVyd2lzZSAyMDBcbiAgICovXG4gIHJlYWRvbmx5IG1heEhlYWx0aHlQZXJjZW50PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbWluaW11bSBudW1iZXIgb2YgdGFza3MsIHNwZWNpZmllZCBhcyBhIHBlcmNlbnRhZ2Ugb2ZcbiAgICogdGhlIEFtYXpvbiBFQ1Mgc2VydmljZSdzIERlc2lyZWRDb3VudCB2YWx1ZSwgdGhhdCBtdXN0XG4gICAqIGNvbnRpbnVlIHRvIHJ1biBhbmQgcmVtYWluIGhlYWx0aHkgZHVyaW5nIGEgZGVwbG95bWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSAwIGlmIGRhZW1vbiwgb3RoZXJ3aXNlIDUwXG4gICAqL1xuICByZWFkb25seSBtaW5IZWFsdGh5UGVyY2VudD86IG51bWJlcjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBlbmFibGUgdGhlIGRlcGxveW1lbnQgY2lyY3VpdCBicmVha2VyLiBJZiB0aGlzIHByb3BlcnR5IGlzIGRlZmluZWQsIGNpcmN1aXQgYnJlYWtlciB3aWxsIGJlIGltcGxpY2l0bHlcbiAgICogZW5hYmxlZC5cbiAgICogQGRlZmF1bHQgLSBkaXNhYmxlZFxuICAgKi9cbiAgcmVhZG9ubHkgY2lyY3VpdEJyZWFrZXI/OiBEZXBsb3ltZW50Q2lyY3VpdEJyZWFrZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBFY3NTZXJ2aWNlIGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSUNvbm5lY3RhYmxlLCBJRWNzU2VydmljZSB7XG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgc2VydmljZU5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25zOiBDb25uZWN0aW9ucztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRWNzU2VydmljZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBzZXJ2aWNlTmFtZSxcbiAgICAgIGxhdW5jaFR5cGUgPSBMYXVuY2hUeXBlLkZBUkdBVEUsXG4gICAgICBwbGF0Zm9ybVZlcnNpb24gPSAnMS40LjAnLFxuICAgICAgZGVzaXJlZENvdW50ID0gMSxcbiAgICAgIHByb2RUYXJnZXRHcm91cCxcbiAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgaGVhbHRoQ2hlY2tHcmFjZVBlcmlvZCxcbiAgICB9ID0gcHJvcHM7XG5cbiAgICBjb25zdCBjb250YWluZXJQb3J0ID0gcHJvcHMuY29udGFpbmVyUG9ydCA/PyB0YXNrRGVmaW5pdGlvbi5jb250YWluZXJQb3J0O1xuXG4gICAgY29uc3QgeyB2cGMgfSA9IGNsdXN0ZXI7XG5cbiAgICBjb25zdCBzZWN1cml0eUdyb3VwcyA9IHByb3BzLnNlY3VyaXR5R3JvdXBzIHx8IFtcbiAgICAgIG5ldyBTZWN1cml0eUdyb3VwKHRoaXMsIGAke2lkfS1TR2AsIHtcbiAgICAgICAgZGVzY3JpcHRpb246IGBTZWN1cml0eSBncm91cCBmb3IgJHt0aGlzLm5vZGUuaWR9IHNlcnZpY2VgLFxuICAgICAgICB2cGMsXG4gICAgICB9KSxcbiAgICBdO1xuXG4gICAgY29uc3Qgc2VydmljZVRva2VuID0gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZSh0aGlzLCBgJHtpZH0tQkdTZXJ2aWNlYCwge1xuICAgICAgY29kZURpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2xhbWJkYXMnLCAnZWNzLXNlcnZpY2UnKSxcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xMl9YLFxuICAgICAgcG9saWN5U3RhdGVtZW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgRWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgICAgQWN0aW9uOiBbJ2VjczpDcmVhdGVTZXJ2aWNlJywgJ2VjczpVcGRhdGVTZXJ2aWNlJywgJ2VjczpEZWxldGVTZXJ2aWNlJywgJ2VjczpEZXNjcmliZVNlcnZpY2VzJ10sXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICAgIEFjdGlvbjogWydpYW06UGFzc1JvbGUnXSxcbiAgICAgICAgICBSZXNvdXJjZTogdGFza0RlZmluaXRpb24uZXhlY3V0aW9uUm9sZS5yb2xlQXJuLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgYCR7aWR9LUVDU0NSYCwge1xuICAgICAgc2VydmljZVRva2VuLFxuICAgICAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpCbHVlR3JlZW5TZXJ2aWNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgQ2x1c3RlcjogY2x1c3Rlci5jbHVzdGVyTmFtZSxcbiAgICAgICAgU2VydmljZU5hbWU6IHNlcnZpY2VOYW1lLFxuICAgICAgICBDb250YWluZXJOYW1lOiB0YXNrRGVmaW5pdGlvbi5jb250YWluZXJOYW1lLFxuICAgICAgICBUYXNrRGVmaW5pdGlvbjogdGFza0RlZmluaXRpb24udGFza0RlZmluaXRpb25Bcm4sXG4gICAgICAgIExhdW5jaFR5cGU6IGxhdW5jaFR5cGUsXG4gICAgICAgIFBsYXRmb3JtVmVyc2lvbjogcGxhdGZvcm1WZXJzaW9uLFxuICAgICAgICBEZXNpcmVkQ291bnQ6IGRlc2lyZWRDb3VudCxcbiAgICAgICAgU3VibmV0czogdnBjLmlzb2xhdGVkU3VibmV0cy5tYXAoKHNuKSA9PiBzbi5zdWJuZXRJZCksXG4gICAgICAgIFNlY3VyaXR5R3JvdXBzOiBzZWN1cml0eUdyb3Vwcy5tYXAoKHNnKSA9PiBzZy5zZWN1cml0eUdyb3VwSWQpLFxuICAgICAgICBUYXJnZXRHcm91cEFybjogcHJvZFRhcmdldEdyb3VwLnRhcmdldEdyb3VwQXJuLFxuICAgICAgICBDb250YWluZXJQb3J0OiBjb250YWluZXJQb3J0LFxuICAgICAgICBTY2hlZHVsaW5nU3RyYXRlZ3k6IFNjaGVkdWxpbmdTdHJhdGVneS5SRVBMSUNBLFxuICAgICAgICBIZWFsdGhDaGVja0dyYWNlUGVyaW9kOiBoZWFsdGhDaGVja0dyYWNlUGVyaW9kLnRvU2Vjb25kcygpLFxuICAgICAgICBEZXBsb3ltZW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIG1heGltdW1QZXJjZW50OiBwcm9wcy5tYXhIZWFsdGh5UGVyY2VudCA/PyAyMDAsXG4gICAgICAgICAgbWluaW11bUhlYWx0aHlQZXJjZW50OiBwcm9wcy5taW5IZWFsdGh5UGVyY2VudCA/PyA1MCxcbiAgICAgICAgICBkZXBsb3ltZW50Q2lyY3VpdEJyZWFrZXI6IHByb3BzLmNpcmN1aXRCcmVha2VyXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgcm9sbGJhY2s6IHByb3BzLmNpcmN1aXRCcmVha2VyLnJvbGxiYWNrID8/IGZhbHNlLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBzZXJ2aWNlLm5vZGUuYWRkRGVwZW5kZW5jeShwcm9kVGFyZ2V0R3JvdXAubG9hZEJhbGFuY2VyQXR0YWNoZWQpO1xuXG4gICAgdGhpcy5zZXJ2aWNlTmFtZSA9IHNlcnZpY2UuZ2V0QXR0U3RyaW5nKCdTZXJ2aWNlTmFtZScpO1xuICAgIHRoaXMuY2x1c3Rlck5hbWUgPSBjbHVzdGVyLmNsdXN0ZXJOYW1lO1xuXG4gICAgdGhpcy5jb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9ucyh7XG4gICAgICBzZWN1cml0eUdyb3VwcyxcbiAgICAgIGRlZmF1bHRQb3J0OiBQb3J0LnRjcChjb250YWluZXJQb3J0KSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZW51bSBTY2hlZHVsaW5nU3RyYXRlZ3kge1xuICBSRVBMSUNBID0gJ1JFUExJQ0EnLFxuICBEQUVNT04gPSAnREFFTU9OJyxcbn1cbiJdfQ==