"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushImageProject = void 0;
const aws_codebuild_1 = require("@aws-cdk/aws-codebuild");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const build_spec_generator_1 = require("./build-spec-generator");
class PushImageProject extends aws_codebuild_1.PipelineProject {
    constructor(scope, id, props) {
        const { account, region } = core_1.Stack.of(scope);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC1pbWFnZS1wcm9qZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3B1c2gtaW1hZ2UtcHJvamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwREFTZ0M7QUFFaEMsOENBQW1EO0FBQ25ELHdDQUFpRDtBQUVqRCxpRUFBNEQ7QUFhNUQsTUFBYSxnQkFBaUIsU0FBUSwrQkFBZTtJQUNuRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTRCO1FBQ3BFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssSUFBSSxxQkFBSyxDQUFDLEtBQUssQ0FBQyw4QkFBYyxDQUFDLFlBQVksRUFBRSw4QkFBYyxDQUFDLE1BQU0sQ0FBQztZQUNyRixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsSUFBSSx5QkFBUyxDQUFDLFVBQVUsQ0FBQyx5Q0FBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1RyxXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFLCtCQUFlLENBQUMsWUFBWTtnQkFDeEMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLElBQUksMkJBQVcsQ0FBQyxLQUFLO2dCQUNuRCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsb0JBQW9CLEVBQUU7b0JBQ3BCLGNBQWMsRUFBRTt3QkFDZCxJQUFJLEVBQUUsNENBQTRCLENBQUMsU0FBUzt3QkFDNUMsS0FBSyxFQUFFLE9BQU87cUJBQ2Y7b0JBQ0Qsa0JBQWtCLEVBQUU7d0JBQ2xCLElBQUksRUFBRSw0Q0FBNEIsQ0FBQyxTQUFTO3dCQUM1QyxLQUFLLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsT0FBTztxQkFDbEQ7b0JBQ0QsTUFBTSxFQUFFO3dCQUNOLElBQUksRUFBRSw0Q0FBNEIsQ0FBQyxTQUFTO3dCQUM1QyxLQUFLLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNO3FCQUNuQztvQkFDRCxjQUFjLEVBQUU7d0JBQ2QsSUFBSSxFQUFFLDRDQUE0QixDQUFDLFNBQVM7d0JBQzVDLEtBQUssRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLGFBQWE7cUJBQzNDO29CQUNELEdBQUcsS0FBSyxDQUFDLG9CQUFvQjtpQkFDOUI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxlQUFlLENBQ2xCLElBQUkseUJBQWUsQ0FBQztZQUNsQixPQUFPLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztZQUN0QyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDakIsQ0FBQyxDQUNILENBQUM7UUFFRixJQUFJLENBQUMsZUFBZSxDQUNsQixJQUFJLHlCQUFlLENBQUM7WUFDbEIsT0FBTyxFQUFFO2dCQUNQLDRCQUE0QjtnQkFDNUIsbUJBQW1CO2dCQUNuQixpQ0FBaUM7Z0JBQ2pDLGNBQWM7Z0JBQ2QseUJBQXlCO2dCQUN6QixxQkFBcUI7Z0JBQ3JCLHlCQUF5QjthQUMxQjtZQUNELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDO1NBQ2pELENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBeERELDRDQXdEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ2FjaGUsXHJcbiAgTG9jYWxDYWNoZU1vZGUsXHJcbiAgUGlwZWxpbmVQcm9qZWN0LFxyXG4gIEJ1aWxkU3BlYyxcclxuICBMaW51eEJ1aWxkSW1hZ2UsXHJcbiAgQ29tcHV0ZVR5cGUsXHJcbiAgQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlLFxyXG4gIEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUsXHJcbn0gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVidWlsZCc7XHJcbmltcG9ydCB7IElSZXBvc2l0b3J5IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjcic7XHJcbmltcG9ydCB7IFBvbGljeVN0YXRlbWVudCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBCdWlsZFNwZWNHZW5lcmF0b3IgfSBmcm9tICcuL2J1aWxkLXNwZWMtZ2VuZXJhdG9yJztcclxuaW1wb3J0IHsgSUR1bW15VGFza0RlZmluaXRpb24gfSBmcm9tICcuL2R1bW15LXRhc2stZGVmaW5pdGlvbic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFB1c2hJbWFnZVByb2plY3RQcm9wcyB7XHJcbiAgcmVhZG9ubHkgaW1hZ2VSZXBvc2l0b3J5OiBJUmVwb3NpdG9yeTtcclxuICByZWFkb25seSB0YXNrRGVmaW5pdGlvbjogSUR1bW15VGFza0RlZmluaXRpb247XHJcbiAgcmVhZG9ubHkgZW52aXJvbm1lbnRWYXJpYWJsZXM/OiBSZWNvcmQ8c3RyaW5nLCBCdWlsZEVudmlyb25tZW50VmFyaWFibGU+O1xyXG4gIHJlYWRvbmx5IHByb2plY3ROYW1lPzogc3RyaW5nO1xyXG4gIHJlYWRvbmx5IGNhY2hlPzogQ2FjaGU7XHJcbiAgcmVhZG9ubHkgYnVpbGRTcGVjPzogQnVpbGRTcGVjO1xyXG4gIHJlYWRvbmx5IGNvbXB1dGVUeXBlPzogQ29tcHV0ZVR5cGU7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQdXNoSW1hZ2VQcm9qZWN0IGV4dGVuZHMgUGlwZWxpbmVQcm9qZWN0IHtcclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUHVzaEltYWdlUHJvamVjdFByb3BzKSB7XHJcbiAgICBjb25zdCB7IGFjY291bnQsIHJlZ2lvbiB9ID0gU3RhY2sub2Yoc2NvcGUpO1xyXG5cclxuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xyXG4gICAgICBwcm9qZWN0TmFtZTogcHJvcHMucHJvamVjdE5hbWUsXHJcbiAgICAgIGNhY2hlOiBwcm9wcy5jYWNoZSB8fCBDYWNoZS5sb2NhbChMb2NhbENhY2hlTW9kZS5ET0NLRVJfTEFZRVIsIExvY2FsQ2FjaGVNb2RlLkNVU1RPTSksXHJcbiAgICAgIGJ1aWxkU3BlYzogcHJvcHMuYnVpbGRTcGVjIHx8IEJ1aWxkU3BlYy5mcm9tT2JqZWN0KEJ1aWxkU3BlY0dlbmVyYXRvci5kZWZhdWx0KHsgYWNjb3VudCwgcmVnaW9uIH0pLnJlbmRlcigpKSxcclxuICAgICAgZW52aXJvbm1lbnQ6IHtcclxuICAgICAgICBidWlsZEltYWdlOiBMaW51eEJ1aWxkSW1hZ2UuU1RBTkRBUkRfNF8wLFxyXG4gICAgICAgIGNvbXB1dGVUeXBlOiBwcm9wcy5jb21wdXRlVHlwZSB8fCBDb21wdXRlVHlwZS5TTUFMTCxcclxuICAgICAgICBwcml2aWxlZ2VkOiB0cnVlLFxyXG4gICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XHJcbiAgICAgICAgICBBV1NfQUNDT1VOVF9JRDoge1xyXG4gICAgICAgICAgICB0eXBlOiBCdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLlBMQUlOVEVYVCxcclxuICAgICAgICAgICAgdmFsdWU6IGFjY291bnQsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgRVhFQ1VUSU9OX1JPTEVfQVJOOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuUExBSU5URVhULFxyXG4gICAgICAgICAgICB2YWx1ZTogcHJvcHMudGFza0RlZmluaXRpb24uZXhlY3V0aW9uUm9sZS5yb2xlQXJuLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIEZBTUlMWToge1xyXG4gICAgICAgICAgICB0eXBlOiBCdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLlBMQUlOVEVYVCxcclxuICAgICAgICAgICAgdmFsdWU6IHByb3BzLnRhc2tEZWZpbml0aW9uLmZhbWlseSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBSRVBPU0lUT1JZX1VSSToge1xyXG4gICAgICAgICAgICB0eXBlOiBCdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLlBMQUlOVEVYVCxcclxuICAgICAgICAgICAgdmFsdWU6IHByb3BzLmltYWdlUmVwb3NpdG9yeS5yZXBvc2l0b3J5VXJpLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIC4uLnByb3BzLmVudmlyb25tZW50VmFyaWFibGVzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZFRvUm9sZVBvbGljeShcclxuICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgICAgYWN0aW9uczogWydlY3I6R2V0QXV0aG9yaXphdGlvblRva2VuJ10sXHJcbiAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcclxuICAgICAgfSksXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYWRkVG9Sb2xlUG9saWN5KFxyXG4gICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHtcclxuICAgICAgICBhY3Rpb25zOiBbXHJcbiAgICAgICAgICAnZWNyOkdldERvd25sb2FkVXJsRm9yTGF5ZXInLFxyXG4gICAgICAgICAgJ2VjcjpCYXRjaEdldEltYWdlJyxcclxuICAgICAgICAgICdlY3I6QmF0Y2hDaGVja0xheWVyQXZhaWxhYmlsaXR5JyxcclxuICAgICAgICAgICdlY3I6UHV0SW1hZ2UnLFxyXG4gICAgICAgICAgJ2VjcjpJbml0aWF0ZUxheWVyVXBsb2FkJyxcclxuICAgICAgICAgICdlY3I6VXBsb2FkTGF5ZXJQYXJ0JyxcclxuICAgICAgICAgICdlY3I6Q29tcGxldGVMYXllclVwbG9hZCcsXHJcbiAgICAgICAgXSxcclxuICAgICAgICByZXNvdXJjZXM6IFtwcm9wcy5pbWFnZVJlcG9zaXRvcnkucmVwb3NpdG9yeUFybl0sXHJcbiAgICAgIH0pLFxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19