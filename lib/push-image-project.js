"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushImageProject = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_codebuild_1 = require("aws-cdk-lib/aws-codebuild");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
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
_a = JSII_RTTI_SYMBOL_1;
PushImageProject[_a] = { fqn: "@linz/cdk-blue-green-container-deployment.PushImageProject", version: "1.48.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC1pbWFnZS1wcm9qZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3B1c2gtaW1hZ2UtcHJvamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZEQVNtQztBQUVuQyxpREFBc0Q7QUFDdEQsNkNBQW9DO0FBRXBDLGlFQUE0RDtBQWM1RCxNQUFhLGdCQUFpQixTQUFRLCtCQUFlO0lBQ25ELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBNEI7UUFDcEUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxtQkFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssSUFBSSxxQkFBSyxDQUFDLEtBQUssQ0FBQyw4QkFBYyxDQUFDLFlBQVksRUFBRSw4QkFBYyxDQUFDLE1BQU0sQ0FBQztZQUNyRixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsSUFBSSx5QkFBUyxDQUFDLFVBQVUsQ0FBQyx5Q0FBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1RyxXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFLCtCQUFlLENBQUMsWUFBWTtnQkFDeEMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLElBQUksMkJBQVcsQ0FBQyxLQUFLO2dCQUNuRCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsb0JBQW9CLEVBQUU7b0JBQ3BCLGNBQWMsRUFBRTt3QkFDZCxJQUFJLEVBQUUsNENBQTRCLENBQUMsU0FBUzt3QkFDNUMsS0FBSyxFQUFFLE9BQU87cUJBQ2Y7b0JBQ0Qsa0JBQWtCLEVBQUU7d0JBQ2xCLElBQUksRUFBRSw0Q0FBNEIsQ0FBQyxTQUFTO3dCQUM1QyxLQUFLLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsT0FBTztxQkFDbEQ7b0JBQ0QsTUFBTSxFQUFFO3dCQUNOLElBQUksRUFBRSw0Q0FBNEIsQ0FBQyxTQUFTO3dCQUM1QyxLQUFLLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNO3FCQUNuQztvQkFDRCxjQUFjLEVBQUU7d0JBQ2QsSUFBSSxFQUFFLDRDQUE0QixDQUFDLFNBQVM7d0JBQzVDLEtBQUssRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLGFBQWE7cUJBQzNDO29CQUNELEdBQUcsS0FBSyxDQUFDLG9CQUFvQjtpQkFDOUI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxlQUFlLENBQ2xCLElBQUkseUJBQWUsQ0FBQztZQUNsQixPQUFPLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztZQUN0QyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDakIsQ0FBQyxDQUNILENBQUM7UUFFRixJQUFJLENBQUMsZUFBZSxDQUNsQixJQUFJLHlCQUFlLENBQUM7WUFDbEIsT0FBTyxFQUFFO2dCQUNQLDRCQUE0QjtnQkFDNUIsbUJBQW1CO2dCQUNuQixpQ0FBaUM7Z0JBQ2pDLGNBQWM7Z0JBQ2QseUJBQXlCO2dCQUN6QixxQkFBcUI7Z0JBQ3JCLHlCQUF5QjthQUMxQjtZQUNELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDO1NBQ2pELENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQzs7QUF2REgsNENBd0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2FjaGUsXG4gIExvY2FsQ2FjaGVNb2RlLFxuICBQaXBlbGluZVByb2plY3QsXG4gIEJ1aWxkU3BlYyxcbiAgTGludXhCdWlsZEltYWdlLFxuICBDb21wdXRlVHlwZSxcbiAgQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlLFxuICBCdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLFxufSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCB7IElSZXBvc2l0b3J5IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcic7XG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuXG5pbXBvcnQgeyBCdWlsZFNwZWNHZW5lcmF0b3IgfSBmcm9tICcuL2J1aWxkLXNwZWMtZ2VuZXJhdG9yJztcbmltcG9ydCB7IElEdW1teVRhc2tEZWZpbml0aW9uIH0gZnJvbSAnLi9kdW1teS10YXNrLWRlZmluaXRpb24nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHVzaEltYWdlUHJvamVjdFByb3BzIHtcbiAgcmVhZG9ubHkgaW1hZ2VSZXBvc2l0b3J5OiBJUmVwb3NpdG9yeTtcbiAgcmVhZG9ubHkgdGFza0RlZmluaXRpb246IElEdW1teVRhc2tEZWZpbml0aW9uO1xuICByZWFkb25seSBlbnZpcm9ubWVudFZhcmlhYmxlcz86IFJlY29yZDxzdHJpbmcsIEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZT47XG4gIHJlYWRvbmx5IHByb2plY3ROYW1lPzogc3RyaW5nO1xuICByZWFkb25seSBjYWNoZT86IENhY2hlO1xuICByZWFkb25seSBidWlsZFNwZWM/OiBCdWlsZFNwZWM7XG4gIHJlYWRvbmx5IGNvbXB1dGVUeXBlPzogQ29tcHV0ZVR5cGU7XG59XG5cbmV4cG9ydCBjbGFzcyBQdXNoSW1hZ2VQcm9qZWN0IGV4dGVuZHMgUGlwZWxpbmVQcm9qZWN0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFB1c2hJbWFnZVByb2plY3RQcm9wcykge1xuICAgIGNvbnN0IHsgYWNjb3VudCwgcmVnaW9uIH0gPSBTdGFjay5vZihzY29wZSk7XG5cbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHByb2plY3ROYW1lOiBwcm9wcy5wcm9qZWN0TmFtZSxcbiAgICAgIGNhY2hlOiBwcm9wcy5jYWNoZSB8fCBDYWNoZS5sb2NhbChMb2NhbENhY2hlTW9kZS5ET0NLRVJfTEFZRVIsIExvY2FsQ2FjaGVNb2RlLkNVU1RPTSksXG4gICAgICBidWlsZFNwZWM6IHByb3BzLmJ1aWxkU3BlYyB8fCBCdWlsZFNwZWMuZnJvbU9iamVjdChCdWlsZFNwZWNHZW5lcmF0b3IuZGVmYXVsdCh7IGFjY291bnQsIHJlZ2lvbiB9KS5yZW5kZXIoKSksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBidWlsZEltYWdlOiBMaW51eEJ1aWxkSW1hZ2UuU1RBTkRBUkRfNF8wLFxuICAgICAgICBjb21wdXRlVHlwZTogcHJvcHMuY29tcHV0ZVR5cGUgfHwgQ29tcHV0ZVR5cGUuU01BTEwsXG4gICAgICAgIHByaXZpbGVnZWQ6IHRydWUsXG4gICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICAgQVdTX0FDQ09VTlRfSUQ6IHtcbiAgICAgICAgICAgIHR5cGU6IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuUExBSU5URVhULFxuICAgICAgICAgICAgdmFsdWU6IGFjY291bnQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBFWEVDVVRJT05fUk9MRV9BUk46IHtcbiAgICAgICAgICAgIHR5cGU6IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuUExBSU5URVhULFxuICAgICAgICAgICAgdmFsdWU6IHByb3BzLnRhc2tEZWZpbml0aW9uLmV4ZWN1dGlvblJvbGUucm9sZUFybixcbiAgICAgICAgICB9LFxuICAgICAgICAgIEZBTUlMWToge1xuICAgICAgICAgICAgdHlwZTogQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5QTEFJTlRFWFQsXG4gICAgICAgICAgICB2YWx1ZTogcHJvcHMudGFza0RlZmluaXRpb24uZmFtaWx5LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUkVQT1NJVE9SWV9VUkk6IHtcbiAgICAgICAgICAgIHR5cGU6IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuUExBSU5URVhULFxuICAgICAgICAgICAgdmFsdWU6IHByb3BzLmltYWdlUmVwb3NpdG9yeS5yZXBvc2l0b3J5VXJpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4ucHJvcHMuZW52aXJvbm1lbnRWYXJpYWJsZXMsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRUb1JvbGVQb2xpY3koXG4gICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydlY3I6R2V0QXV0aG9yaXphdGlvblRva2VuJ10sXG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgdGhpcy5hZGRUb1JvbGVQb2xpY3koXG4gICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICdlY3I6R2V0RG93bmxvYWRVcmxGb3JMYXllcicsXG4gICAgICAgICAgJ2VjcjpCYXRjaEdldEltYWdlJyxcbiAgICAgICAgICAnZWNyOkJhdGNoQ2hlY2tMYXllckF2YWlsYWJpbGl0eScsXG4gICAgICAgICAgJ2VjcjpQdXRJbWFnZScsXG4gICAgICAgICAgJ2VjcjpJbml0aWF0ZUxheWVyVXBsb2FkJyxcbiAgICAgICAgICAnZWNyOlVwbG9hZExheWVyUGFydCcsXG4gICAgICAgICAgJ2VjcjpDb21wbGV0ZUxheWVyVXBsb2FkJyxcbiAgICAgICAgXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbcHJvcHMuaW1hZ2VSZXBvc2l0b3J5LnJlcG9zaXRvcnlBcm5dLFxuICAgICAgfSksXG4gICAgKTtcbiAgfVxufVxuIl19