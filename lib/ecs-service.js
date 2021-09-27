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
                Subnets: vpc.privateSubnets.map((sn) => sn.subnetId),
                SecurityGroups: securityGroups.map((sg) => sg.securityGroupId),
                TargetGroupArn: prodTargetGroup.targetGroupArn,
                ContainerPort: containerPort,
                SchedulingStrategy: SchedulingStrategy.REPLICA,
                HealthCheckGracePeriod: healthCheckGracePeriod ? healthCheckGracePeriod.toSeconds() : 300,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZWNzLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLDhDQUFrRjtBQUNsRiw4Q0FBa0Y7QUFFbEYsOENBQTBDO0FBQzFDLHdDQUEySDtBQXNEM0gsTUFBYSxVQUFXLFNBQVEsZ0JBQVM7SUFLdkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjs7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEVBQ0osT0FBTyxFQUNQLFdBQVcsRUFDWCxVQUFVLEdBQUcsb0JBQVUsQ0FBQyxPQUFPLEVBQy9CLGVBQWUsR0FBRyxPQUFPLEVBQ3pCLFlBQVksR0FBRyxDQUFDLEVBQ2hCLGVBQWUsRUFDZixjQUFjLEVBQ2Qsc0JBQXNCLEdBQ3ZCLEdBQUcsS0FBSyxDQUFDO1FBRVYsTUFBTSxhQUFhLFNBQUcsS0FBSyxDQUFDLGFBQWEsbUNBQUksY0FBYyxDQUFDLGFBQWEsQ0FBQztRQUUxRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRXhCLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLElBQUk7WUFDN0MsSUFBSSx1QkFBYSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO2dCQUNsQyxXQUFXLEVBQUUsc0JBQXNCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVO2dCQUN6RCxHQUFHO2FBQ0osQ0FBQztTQUNILENBQUM7UUFFRixNQUFNLFlBQVksR0FBRyw2QkFBc0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUU7WUFDL0UsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxhQUFhLENBQUM7WUFDN0QsT0FBTyxFQUFFLG9DQUE2QixDQUFDLFdBQVc7WUFDbEQsZ0JBQWdCLEVBQUU7Z0JBQ2hCO29CQUNFLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7b0JBQ3BCLE1BQU0sRUFBRSxDQUFDLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDO29CQUMvRixRQUFRLEVBQUUsR0FBRztpQkFDZDtnQkFDRDtvQkFDRSxNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO29CQUNwQixNQUFNLEVBQUUsQ0FBQyxjQUFjLENBQUM7b0JBQ3hCLFFBQVEsRUFBRSxjQUFjLENBQUMsYUFBYSxDQUFDLE9BQU87aUJBQy9DO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUU7WUFDdEQsWUFBWTtZQUNaLFlBQVksRUFBRSwwQkFBMEI7WUFDeEMsVUFBVSxFQUFFO2dCQUNWLE9BQU8sRUFBRSxPQUFPLENBQUMsV0FBVztnQkFDNUIsV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLGFBQWEsRUFBRSxjQUFjLENBQUMsYUFBYTtnQkFDM0MsY0FBYyxFQUFFLGNBQWMsQ0FBQyxpQkFBaUI7Z0JBQ2hELFVBQVUsRUFBRSxVQUFVO2dCQUN0QixlQUFlLEVBQUUsZUFBZTtnQkFDaEMsWUFBWSxFQUFFLFlBQVk7Z0JBQzFCLE9BQU8sRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFDcEQsY0FBYyxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQzlELGNBQWMsRUFBRSxlQUFlLENBQUMsY0FBYztnQkFDOUMsYUFBYSxFQUFFLGFBQWE7Z0JBQzVCLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLE9BQU87Z0JBQzlDLHNCQUFzQixFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRztnQkFDekYsdUJBQXVCLEVBQUU7b0JBQ3ZCLGNBQWMsUUFBRSxLQUFLLENBQUMsaUJBQWlCLG1DQUFJLEdBQUc7b0JBQzlDLHFCQUFxQixRQUFFLEtBQUssQ0FBQyxpQkFBaUIsbUNBQUksRUFBRTtvQkFDcEQsd0JBQXdCLEVBQUUsS0FBSyxDQUFDLGNBQWM7d0JBQzVDLENBQUMsQ0FBQzs0QkFDRSxNQUFNLEVBQUUsSUFBSTs0QkFDWixRQUFRLFFBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLG1DQUFJLEtBQUs7eUJBQ2pEO3dCQUNILENBQUMsQ0FBQyxTQUFTO2lCQUNkO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUVqRSxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBRXZDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxxQkFBVyxDQUFDO1lBQ2pDLGNBQWM7WUFDZCxXQUFXLEVBQUUsY0FBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUM7U0FDckMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBdkZELGdDQXVGQztBQUVELElBQVksa0JBR1g7QUFIRCxXQUFZLGtCQUFrQjtJQUM1Qix5Q0FBbUIsQ0FBQTtJQUNuQix1Q0FBaUIsQ0FBQTtBQUNuQixDQUFDLEVBSFcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFHN0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgSUNvbm5lY3RhYmxlLCBDb25uZWN0aW9ucywgU2VjdXJpdHlHcm91cCwgUG9ydCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgSUNsdXN0ZXIsIExhdW5jaFR5cGUsIERlcGxveW1lbnRDaXJjdWl0QnJlYWtlciB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3MnO1xuaW1wb3J0IHsgSVRhcmdldEdyb3VwIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0IHsgRWZmZWN0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgQ29uc3RydWN0LCBDdXN0b21SZXNvdXJjZSwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlciwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcblxuaW1wb3J0IHsgRHVtbXlUYXNrRGVmaW5pdGlvbiB9IGZyb20gJy4vZHVtbXktdGFzay1kZWZpbml0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBJRWNzU2VydmljZSB7XG4gIHJlYWRvbmx5IGNsdXN0ZXJOYW1lOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHNlcnZpY2VOYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWNzU2VydmljZVByb3BzIHtcbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cHM/OiBTZWN1cml0eUdyb3VwW107XG4gIHJlYWRvbmx5IGNsdXN0ZXI6IElDbHVzdGVyO1xuICByZWFkb25seSBzZXJ2aWNlTmFtZTogc3RyaW5nO1xuICByZWFkb25seSBsYXVuY2hUeXBlPzogTGF1bmNoVHlwZTtcbiAgcmVhZG9ubHkgcGxhdGZvcm1WZXJzaW9uPzogc3RyaW5nO1xuICByZWFkb25seSBkZXNpcmVkQ291bnQ/OiBudW1iZXI7XG4gIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ/OiBudW1iZXI7XG4gIHJlYWRvbmx5IHByb2RUYXJnZXRHcm91cDogSVRhcmdldEdyb3VwO1xuICByZWFkb25seSB0YXNrRGVmaW5pdGlvbjogRHVtbXlUYXNrRGVmaW5pdGlvbjtcblxuICAvKipcbiAgICogVGhlIHBlcmlvZCBvZiB0aW1lLCBpbiBzZWNvbmRzLCB0aGF0IHRoZSBBbWF6b24gRUNTIHNlcnZpY2Ugc2NoZWR1bGVyIGlnbm9yZXMgdW5oZWFsdGh5XG4gICAqIEVsYXN0aWMgTG9hZCBCYWxhbmNpbmcgdGFyZ2V0IGhlYWx0aCBjaGVja3MgYWZ0ZXIgYSB0YXNrIGhhcyBmaXJzdCBzdGFydGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRlZmF1bHRzIHRvIDYwIHNlY29uZHMgaWYgYXQgbGVhc3Qgb25lIGxvYWQgYmFsYW5jZXIgaXMgaW4tdXNlIGFuZCBpdCBpcyBub3QgYWxyZWFkeSBzZXRcbiAgICovXG4gIHJlYWRvbmx5IGhlYWx0aENoZWNrR3JhY2VQZXJpb2Q/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIG1heGltdW0gbnVtYmVyIG9mIHRhc2tzLCBzcGVjaWZpZWQgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSBBbWF6b24gRUNTXG4gICAqIHNlcnZpY2UncyBEZXNpcmVkQ291bnQgdmFsdWUsIHRoYXQgY2FuIHJ1biBpbiBhIHNlcnZpY2UgZHVyaW5nIGFcbiAgICogZGVwbG95bWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSAxMDAgaWYgZGFlbW9uLCBvdGhlcndpc2UgMjAwXG4gICAqL1xuICByZWFkb25seSBtYXhIZWFsdGh5UGVyY2VudD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIG1pbmltdW0gbnVtYmVyIG9mIHRhc2tzLCBzcGVjaWZpZWQgYXMgYSBwZXJjZW50YWdlIG9mXG4gICAqIHRoZSBBbWF6b24gRUNTIHNlcnZpY2UncyBEZXNpcmVkQ291bnQgdmFsdWUsIHRoYXQgbXVzdFxuICAgKiBjb250aW51ZSB0byBydW4gYW5kIHJlbWFpbiBoZWFsdGh5IGR1cmluZyBhIGRlcGxveW1lbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gMCBpZiBkYWVtb24sIG90aGVyd2lzZSA1MFxuICAgKi9cbiAgcmVhZG9ubHkgbWluSGVhbHRoeVBlcmNlbnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZW5hYmxlIHRoZSBkZXBsb3ltZW50IGNpcmN1aXQgYnJlYWtlci4gSWYgdGhpcyBwcm9wZXJ0eSBpcyBkZWZpbmVkLCBjaXJjdWl0IGJyZWFrZXIgd2lsbCBiZSBpbXBsaWNpdGx5XG4gICAqIGVuYWJsZWQuXG4gICAqIEBkZWZhdWx0IC0gZGlzYWJsZWRcbiAgICovXG4gIHJlYWRvbmx5IGNpcmN1aXRCcmVha2VyPzogRGVwbG95bWVudENpcmN1aXRCcmVha2VyO1xufVxuXG5leHBvcnQgY2xhc3MgRWNzU2VydmljZSBleHRlbmRzIENvbnN0cnVjdCBpbXBsZW1lbnRzIElDb25uZWN0YWJsZSwgSUVjc1NlcnZpY2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgY2x1c3Rlck5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2VOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uczogQ29ubmVjdGlvbnM7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEVjc1NlcnZpY2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgc2VydmljZU5hbWUsXG4gICAgICBsYXVuY2hUeXBlID0gTGF1bmNoVHlwZS5GQVJHQVRFLFxuICAgICAgcGxhdGZvcm1WZXJzaW9uID0gJzEuNC4wJyxcbiAgICAgIGRlc2lyZWRDb3VudCA9IDEsXG4gICAgICBwcm9kVGFyZ2V0R3JvdXAsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIGhlYWx0aENoZWNrR3JhY2VQZXJpb2QsXG4gICAgfSA9IHByb3BzO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydCA9IHByb3BzLmNvbnRhaW5lclBvcnQgPz8gdGFza0RlZmluaXRpb24uY29udGFpbmVyUG9ydDtcblxuICAgIGNvbnN0IHsgdnBjIH0gPSBjbHVzdGVyO1xuXG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cHMgPSBwcm9wcy5zZWN1cml0eUdyb3VwcyB8fCBbXG4gICAgICBuZXcgU2VjdXJpdHlHcm91cCh0aGlzLCBgJHtpZH0tU0dgLCB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBgU2VjdXJpdHkgZ3JvdXAgZm9yICR7dGhpcy5ub2RlLmlkfSBzZXJ2aWNlYCxcbiAgICAgICAgdnBjLFxuICAgICAgfSksXG4gICAgXTtcblxuICAgIGNvbnN0IHNlcnZpY2VUb2tlbiA9IEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGUodGhpcywgYCR7aWR9LUJHU2VydmljZWAsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICdsYW1iZGFzJywgJ2Vjcy1zZXJ2aWNlJyksXG4gICAgICBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTJfWCxcbiAgICAgIHBvbGljeVN0YXRlbWVudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICAgIEFjdGlvbjogWydlY3M6Q3JlYXRlU2VydmljZScsICdlY3M6VXBkYXRlU2VydmljZScsICdlY3M6RGVsZXRlU2VydmljZScsICdlY3M6RGVzY3JpYmVTZXJ2aWNlcyddLFxuICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBFZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgICAgICBBY3Rpb246IFsnaWFtOlBhc3NSb2xlJ10sXG4gICAgICAgICAgUmVzb3VyY2U6IHRhc2tEZWZpbml0aW9uLmV4ZWN1dGlvblJvbGUucm9sZUFybixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZXJ2aWNlID0gbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsIGAke2lkfS1FQ1NDUmAsIHtcbiAgICAgIHNlcnZpY2VUb2tlbixcbiAgICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6Qmx1ZUdyZWVuU2VydmljZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIENsdXN0ZXI6IGNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICAgIFNlcnZpY2VOYW1lOiBzZXJ2aWNlTmFtZSxcbiAgICAgICAgQ29udGFpbmVyTmFtZTogdGFza0RlZmluaXRpb24uY29udGFpbmVyTmFtZSxcbiAgICAgICAgVGFza0RlZmluaXRpb246IHRhc2tEZWZpbml0aW9uLnRhc2tEZWZpbml0aW9uQXJuLFxuICAgICAgICBMYXVuY2hUeXBlOiBsYXVuY2hUeXBlLFxuICAgICAgICBQbGF0Zm9ybVZlcnNpb246IHBsYXRmb3JtVmVyc2lvbixcbiAgICAgICAgRGVzaXJlZENvdW50OiBkZXNpcmVkQ291bnQsXG4gICAgICAgIFN1Ym5ldHM6IHZwYy5wcml2YXRlU3VibmV0cy5tYXAoKHNuKSA9PiBzbi5zdWJuZXRJZCksXG4gICAgICAgIFNlY3VyaXR5R3JvdXBzOiBzZWN1cml0eUdyb3Vwcy5tYXAoKHNnKSA9PiBzZy5zZWN1cml0eUdyb3VwSWQpLFxuICAgICAgICBUYXJnZXRHcm91cEFybjogcHJvZFRhcmdldEdyb3VwLnRhcmdldEdyb3VwQXJuLFxuICAgICAgICBDb250YWluZXJQb3J0OiBjb250YWluZXJQb3J0LFxuICAgICAgICBTY2hlZHVsaW5nU3RyYXRlZ3k6IFNjaGVkdWxpbmdTdHJhdGVneS5SRVBMSUNBLFxuICAgICAgICBIZWFsdGhDaGVja0dyYWNlUGVyaW9kOiBoZWFsdGhDaGVja0dyYWNlUGVyaW9kID8gaGVhbHRoQ2hlY2tHcmFjZVBlcmlvZC50b1NlY29uZHMoKSA6IDMwMCxcbiAgICAgICAgRGVwbG95bWVudENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBtYXhpbXVtUGVyY2VudDogcHJvcHMubWF4SGVhbHRoeVBlcmNlbnQgPz8gMjAwLFxuICAgICAgICAgIG1pbmltdW1IZWFsdGh5UGVyY2VudDogcHJvcHMubWluSGVhbHRoeVBlcmNlbnQgPz8gNTAsXG4gICAgICAgICAgZGVwbG95bWVudENpcmN1aXRCcmVha2VyOiBwcm9wcy5jaXJjdWl0QnJlYWtlclxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJvbGxiYWNrOiBwcm9wcy5jaXJjdWl0QnJlYWtlci5yb2xsYmFjayA/PyBmYWxzZSxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgc2VydmljZS5ub2RlLmFkZERlcGVuZGVuY3kocHJvZFRhcmdldEdyb3VwLmxvYWRCYWxhbmNlckF0dGFjaGVkKTtcblxuICAgIHRoaXMuc2VydmljZU5hbWUgPSBzZXJ2aWNlLmdldEF0dFN0cmluZygnU2VydmljZU5hbWUnKTtcbiAgICB0aGlzLmNsdXN0ZXJOYW1lID0gY2x1c3Rlci5jbHVzdGVyTmFtZTtcblxuICAgIHRoaXMuY29ubmVjdGlvbnMgPSBuZXcgQ29ubmVjdGlvbnMoe1xuICAgICAgc2VjdXJpdHlHcm91cHMsXG4gICAgICBkZWZhdWx0UG9ydDogUG9ydC50Y3AoY29udGFpbmVyUG9ydCksXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGVudW0gU2NoZWR1bGluZ1N0cmF0ZWd5IHtcbiAgUkVQTElDQSA9ICdSRVBMSUNBJyxcbiAgREFFTU9OID0gJ0RBRU1PTicsXG59XG4iXX0=