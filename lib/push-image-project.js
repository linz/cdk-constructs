"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushImageProject = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_codebuild_1 = require("aws-cdk-lib/aws-codebuild");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const build_spec_generator_1 = require("./build-spec-generator");
class PushImageProject extends aws_codebuild_1.PipelineProject {
    constructor(scope, id, props) {
        const { account, region } = aws_cdk_lib_1.Stack.of(scope);
        super(scope, id, {
            projectName: props.projectName,
            cache: props.cache || aws_codebuild_1.Cache.local(aws_codebuild_1.LocalCacheMode.DOCKER_LAYER, aws_codebuild_1.LocalCacheMode.CUSTOM),
            buildSpec: props.buildSpec || aws_codebuild_1.BuildSpec.fromObject(build_spec_generator_1.BuildSpecGenerator.default({ account, region }).render()),
            environment: {
                buildImage: aws_codebuild_1.LinuxBuildImage.STANDARD_4_0,
                computeType: props.computeType || aws_codebuild_1.ComputeType.SMALL,
                privileged: true,
                environmentVariables: {
                    AWS_ACCOUNT_ID: {
                        type: aws_codebuild_1.BuildEnvironmentVariableType.PLAINTEXT,
                        value: account,
                    },
                    EXECUTION_ROLE_ARN: {
                        type: aws_codebuild_1.BuildEnvironmentVariableType.PLAINTEXT,
                        value: props.taskDefinition.executionRole.roleArn,
                    },
                    FAMILY: {
                        type: aws_codebuild_1.BuildEnvironmentVariableType.PLAINTEXT,
                        value: props.taskDefinition.family,
                    },
                    REPOSITORY_URI: {
                        type: aws_codebuild_1.BuildEnvironmentVariableType.PLAINTEXT,
                        value: props.imageRepository.repositoryUri,
                    },
                    ...props.environmentVariables,
                },
            },
        });
        this.addToRolePolicy(new aws_iam_1.PolicyStatement({
            actions: ['ecr:GetAuthorizationToken'],
            resources: ['*'],
        }));
        this.addToRolePolicy(new aws_iam_1.PolicyStatement({
            actions: [
                'ecr:GetDownloadUrlForLayer',
                'ecr:BatchGetImage',
                'ecr:BatchCheckLayerAvailability',
                'ecr:PutImage',
                'ecr:InitiateLayerUpload',
                'ecr:UploadLayerPart',
                'ecr:CompleteLayerUpload',
            ],
            resources: [props.imageRepository.repositoryArn],
        }));
    }
}
exports.PushImageProject = PushImageProject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC1pbWFnZS1wcm9qZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3B1c2gtaW1hZ2UtcHJvamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBb0M7QUFDcEMsNkRBU21DO0FBRW5DLGlEQUFzRDtBQUd0RCxpRUFBNEQ7QUFhNUQsTUFBYSxnQkFBaUIsU0FBUSwrQkFBZTtJQUNuRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTRCO1FBQ3BFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsbUJBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFNUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLElBQUkscUJBQUssQ0FBQyxLQUFLLENBQUMsOEJBQWMsQ0FBQyxZQUFZLEVBQUUsOEJBQWMsQ0FBQyxNQUFNLENBQUM7WUFDckYsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLElBQUkseUJBQVMsQ0FBQyxVQUFVLENBQUMseUNBQWtCLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDNUcsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSwrQkFBZSxDQUFDLFlBQVk7Z0JBQ3hDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVyxJQUFJLDJCQUFXLENBQUMsS0FBSztnQkFDbkQsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLG9CQUFvQixFQUFFO29CQUNwQixjQUFjLEVBQUU7d0JBQ2QsSUFBSSxFQUFFLDRDQUE0QixDQUFDLFNBQVM7d0JBQzVDLEtBQUssRUFBRSxPQUFPO3FCQUNmO29CQUNELGtCQUFrQixFQUFFO3dCQUNsQixJQUFJLEVBQUUsNENBQTRCLENBQUMsU0FBUzt3QkFDNUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLE9BQU87cUJBQ2xEO29CQUNELE1BQU0sRUFBRTt3QkFDTixJQUFJLEVBQUUsNENBQTRCLENBQUMsU0FBUzt3QkFDNUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTTtxQkFDbkM7b0JBQ0QsY0FBYyxFQUFFO3dCQUNkLElBQUksRUFBRSw0Q0FBNEIsQ0FBQyxTQUFTO3dCQUM1QyxLQUFLLEVBQUUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxhQUFhO3FCQUMzQztvQkFDRCxHQUFHLEtBQUssQ0FBQyxvQkFBb0I7aUJBQzlCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZUFBZSxDQUNsQixJQUFJLHlCQUFlLENBQUM7WUFDbEIsT0FBTyxFQUFFLENBQUMsMkJBQTJCLENBQUM7WUFDdEMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ2pCLENBQUMsQ0FDSCxDQUFDO1FBRUYsSUFBSSxDQUFDLGVBQWUsQ0FDbEIsSUFBSSx5QkFBZSxDQUFDO1lBQ2xCLE9BQU8sRUFBRTtnQkFDUCw0QkFBNEI7Z0JBQzVCLG1CQUFtQjtnQkFDbkIsaUNBQWlDO2dCQUNqQyxjQUFjO2dCQUNkLHlCQUF5QjtnQkFDekIscUJBQXFCO2dCQUNyQix5QkFBeUI7YUFDMUI7WUFDRCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQztTQUNqRCxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXhERCw0Q0F3REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7XG4gIENhY2hlLFxuICBMb2NhbENhY2hlTW9kZSxcbiAgUGlwZWxpbmVQcm9qZWN0LFxuICBCdWlsZFNwZWMsXG4gIExpbnV4QnVpbGRJbWFnZSxcbiAgQ29tcHV0ZVR5cGUsXG4gIEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZSxcbiAgQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZSxcbn0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgeyBJUmVwb3NpdG9yeSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3InO1xuaW1wb3J0IHsgUG9saWN5U3RhdGVtZW50IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuaW1wb3J0IHsgQnVpbGRTcGVjR2VuZXJhdG9yIH0gZnJvbSAnLi9idWlsZC1zcGVjLWdlbmVyYXRvcic7XG5pbXBvcnQgeyBJRHVtbXlUYXNrRGVmaW5pdGlvbiB9IGZyb20gJy4vZHVtbXktdGFzay1kZWZpbml0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBQdXNoSW1hZ2VQcm9qZWN0UHJvcHMge1xuICByZWFkb25seSBpbWFnZVJlcG9zaXRvcnk6IElSZXBvc2l0b3J5O1xuICByZWFkb25seSB0YXNrRGVmaW5pdGlvbjogSUR1bW15VGFza0RlZmluaXRpb247XG4gIHJlYWRvbmx5IGVudmlyb25tZW50VmFyaWFibGVzPzogUmVjb3JkPHN0cmluZywgQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlPjtcbiAgcmVhZG9ubHkgcHJvamVjdE5hbWU/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGNhY2hlPzogQ2FjaGU7XG4gIHJlYWRvbmx5IGJ1aWxkU3BlYz86IEJ1aWxkU3BlYztcbiAgcmVhZG9ubHkgY29tcHV0ZVR5cGU/OiBDb21wdXRlVHlwZTtcbn1cblxuZXhwb3J0IGNsYXNzIFB1c2hJbWFnZVByb2plY3QgZXh0ZW5kcyBQaXBlbGluZVByb2plY3Qge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUHVzaEltYWdlUHJvamVjdFByb3BzKSB7XG4gICAgY29uc3QgeyBhY2NvdW50LCByZWdpb24gfSA9IFN0YWNrLm9mKHNjb3BlKTtcblxuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcHJvamVjdE5hbWU6IHByb3BzLnByb2plY3ROYW1lLFxuICAgICAgY2FjaGU6IHByb3BzLmNhY2hlIHx8IENhY2hlLmxvY2FsKExvY2FsQ2FjaGVNb2RlLkRPQ0tFUl9MQVlFUiwgTG9jYWxDYWNoZU1vZGUuQ1VTVE9NKSxcbiAgICAgIGJ1aWxkU3BlYzogcHJvcHMuYnVpbGRTcGVjIHx8IEJ1aWxkU3BlYy5mcm9tT2JqZWN0KEJ1aWxkU3BlY0dlbmVyYXRvci5kZWZhdWx0KHsgYWNjb3VudCwgcmVnaW9uIH0pLnJlbmRlcigpKSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIGJ1aWxkSW1hZ2U6IExpbnV4QnVpbGRJbWFnZS5TVEFOREFSRF80XzAsXG4gICAgICAgIGNvbXB1dGVUeXBlOiBwcm9wcy5jb21wdXRlVHlwZSB8fCBDb21wdXRlVHlwZS5TTUFMTCxcbiAgICAgICAgcHJpdmlsZWdlZDogdHJ1ZSxcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgICBBV1NfQUNDT1VOVF9JRDoge1xuICAgICAgICAgICAgdHlwZTogQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5QTEFJTlRFWFQsXG4gICAgICAgICAgICB2YWx1ZTogYWNjb3VudCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEVYRUNVVElPTl9ST0xFX0FSTjoge1xuICAgICAgICAgICAgdHlwZTogQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5QTEFJTlRFWFQsXG4gICAgICAgICAgICB2YWx1ZTogcHJvcHMudGFza0RlZmluaXRpb24uZXhlY3V0aW9uUm9sZS5yb2xlQXJuLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRkFNSUxZOiB7XG4gICAgICAgICAgICB0eXBlOiBCdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLlBMQUlOVEVYVCxcbiAgICAgICAgICAgIHZhbHVlOiBwcm9wcy50YXNrRGVmaW5pdGlvbi5mYW1pbHksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSRVBPU0lUT1JZX1VSSToge1xuICAgICAgICAgICAgdHlwZTogQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5QTEFJTlRFWFQsXG4gICAgICAgICAgICB2YWx1ZTogcHJvcHMuaW1hZ2VSZXBvc2l0b3J5LnJlcG9zaXRvcnlVcmksXG4gICAgICAgICAgfSxcbiAgICAgICAgICAuLi5wcm9wcy5lbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZFRvUm9sZVBvbGljeShcbiAgICAgIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbJ2VjcjpHZXRBdXRob3JpemF0aW9uVG9rZW4nXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICB0aGlzLmFkZFRvUm9sZVBvbGljeShcbiAgICAgIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgJ2VjcjpHZXREb3dubG9hZFVybEZvckxheWVyJyxcbiAgICAgICAgICAnZWNyOkJhdGNoR2V0SW1hZ2UnLFxuICAgICAgICAgICdlY3I6QmF0Y2hDaGVja0xheWVyQXZhaWxhYmlsaXR5JyxcbiAgICAgICAgICAnZWNyOlB1dEltYWdlJyxcbiAgICAgICAgICAnZWNyOkluaXRpYXRlTGF5ZXJVcGxvYWQnLFxuICAgICAgICAgICdlY3I6VXBsb2FkTGF5ZXJQYXJ0JyxcbiAgICAgICAgICAnZWNyOkNvbXBsZXRlTGF5ZXJVcGxvYWQnLFxuICAgICAgICBdLFxuICAgICAgICByZXNvdXJjZXM6IFtwcm9wcy5pbWFnZVJlcG9zaXRvcnkucmVwb3NpdG9yeUFybl0sXG4gICAgICB9KSxcbiAgICApO1xuICB9XG59Il19