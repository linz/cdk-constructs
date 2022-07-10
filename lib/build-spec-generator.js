"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildSpecGenerator = void 0;
class BuildSpecGenerator {
    constructor(spec) {
        this.spec = spec;
    }
    static empty() {
        return new BuildSpecGenerator({ version: '0.2' });
    }
    static default(props) {
        return new BuildSpecGenerator({
            version: '0.2',
            phases: {
                pre_build: {
                    commands: [
                        'echo Build started on `date`',
                        'echo Logging in to Amazon ECR...',
                        'aws --version',
                        `aws ecr get-login-password | docker login --username AWS --password-stdin ${props.account}.dkr.ecr.${props.region}.amazonaws.com`,
                        'COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)',
                        'IMAGE_TAG=${COMMIT_HASH:=latest}',
                        'echo Replacing placeholder...',
                        'sed -i "s|SED_REPLACE_EXECUTION_ROLE_ARN|$EXECUTION_ROLE_ARN|g" taskdef.json',
                        'sed -i "s|SED_REPLACE_FAMILY|$FAMILY|g" taskdef.json',
                        'echo Current taskDefinition:',
                        'cat taskdef.json',
                    ],
                },
                build: {
                    commands: [
                        'echo Building the Docker image...',
                        'docker version',
                        'docker build -t $REPOSITORY_URI:latest -t $REPOSITORY_URI:$IMAGE_TAG -f Dockerfile .',
                    ],
                },
                post_build: {
                    commands: [
                        'echo Pushing the Docker images to container registry...',
                        'docker push $REPOSITORY_URI:latest',
                        'docker push $REPOSITORY_URI:$IMAGE_TAG',
                        'echo Writing image definitions file...',
                        'printf \'{"ImageURI":"%s"}\' $REPOSITORY_URI:$IMAGE_TAG > imageDetail.json',
                        'echo Build completed on `date`',
                    ],
                },
            },
            artifacts: {
                files: ['appspec.yaml', 'taskdef.json'],
                'secondary-artifacts': {
                    ManifestArtifact: {
                        files: ['appspec.yaml', 'taskdef.json'],
                    },
                    ImageArtifact: {
                        files: ['imageDetail.json'],
                    },
                },
            },
        });
    }
    render() {
        return this.spec;
    }
}
exports.BuildSpecGenerator = BuildSpecGenerator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc3BlYy1nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYnVpbGQtc3BlYy1nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBMENBLE1BQWEsa0JBQWtCO0lBd0Q3QixZQUFxQyxJQUF3QjtRQUF4QixTQUFJLEdBQUosSUFBSSxDQUFvQjtJQUFHLENBQUM7SUF2RDFELE1BQU0sQ0FBQyxLQUFLO1FBQ2pCLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFTSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQTRCO1FBQ2hELE9BQU8sSUFBSSxrQkFBa0IsQ0FBQztZQUM1QixPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRTtnQkFDTixTQUFTLEVBQUU7b0JBQ1QsUUFBUSxFQUFFO3dCQUNSLDhCQUE4Qjt3QkFDOUIsa0NBQWtDO3dCQUNsQyxlQUFlO3dCQUNmLDZFQUE2RSxLQUFLLENBQUMsT0FBTyxZQUFZLEtBQUssQ0FBQyxNQUFNLGdCQUFnQjt3QkFDbEkscUVBQXFFO3dCQUNyRSxrQ0FBa0M7d0JBQ2xDLCtCQUErQjt3QkFDL0IsOEVBQThFO3dCQUM5RSxzREFBc0Q7d0JBQ3RELDhCQUE4Qjt3QkFDOUIsa0JBQWtCO3FCQUNuQjtpQkFDRjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsUUFBUSxFQUFFO3dCQUNSLG1DQUFtQzt3QkFDbkMsZ0JBQWdCO3dCQUNoQixzRkFBc0Y7cUJBQ3ZGO2lCQUNGO2dCQUNELFVBQVUsRUFBRTtvQkFDVixRQUFRLEVBQUU7d0JBQ1IseURBQXlEO3dCQUN6RCxvQ0FBb0M7d0JBQ3BDLHdDQUF3Qzt3QkFDeEMsd0NBQXdDO3dCQUN4Qyw0RUFBNEU7d0JBQzVFLGdDQUFnQztxQkFDakM7aUJBQ0Y7YUFDRjtZQUNELFNBQVMsRUFBRTtnQkFDVCxLQUFLLEVBQUUsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDO2dCQUN2QyxxQkFBcUIsRUFBRTtvQkFDckIsZ0JBQWdCLEVBQUU7d0JBQ2hCLEtBQUssRUFBRSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUM7cUJBQ3hDO29CQUNELGFBQWEsRUFBRTt3QkFDYixLQUFLLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztxQkFDNUI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFJTSxNQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7Q0FDRjtBQTdERCxnREE2REMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIEVudiB7XG4gIHJlYWRvbmx5IHZhcmlhYmxlcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG4gIHJlYWRvbmx5ICdwYXJhbWV0ZXItc3RvcmUnPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQaGFzZSB7XG4gIHJlYWRvbmx5ICdydW4tYXMnPzogc3RyaW5nO1xuICByZWFkb25seSBjb21tYW5kczogc3RyaW5nW107XG4gIHJlYWRvbmx5IGZpbmFsbHk/OiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcnRpZmFjdHMge1xuICByZWFkb25seSBmaWxlcz86IHN0cmluZ1tdO1xuICByZWFkb25seSBuYW1lPzogc3RyaW5nO1xuICByZWFkb25seSAnYmFzZS1kaXJlY3RvcnknPzogc3RyaW5nO1xuICByZWFkb25seSAnZGlzY2FyZC1wYXRocyc/OiAneWVzJyB8ICdubyc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJpbWFyeUFydGlmYWN0cyBleHRlbmRzIEFydGlmYWN0cyB7XG4gIHJlYWRvbmx5ICdzZWNvbmRhcnktYXJ0aWZhY3RzJz86IHsgW2tleTogc3RyaW5nXTogQXJ0aWZhY3RzIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FjaGUge1xuICByZWFkb25seSBwYXRoczogc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnVpbGRTcGVjU3RydWN0dXJlIHtcbiAgcmVhZG9ubHkgdmVyc2lvbjogJzAuMic7XG4gIHJlYWRvbmx5ICdydW4tYXMnPzogc3RyaW5nO1xuICByZWFkb25seSBlbnY/OiBFbnY7XG4gIHJlYWRvbmx5IHBoYXNlcz86IHsgW2tleTogc3RyaW5nXTogUGhhc2UgfTtcbiAgcmVhZG9ubHkgYXJ0aWZhY3RzPzogUHJpbWFyeUFydGlmYWN0cztcbiAgcmVhZG9ubHkgY2FjaGU/OiBDYWNoZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEZWZhdWx0QnVpbGRTcGVjUHJvcHMge1xuICByZWFkb25seSBhY2NvdW50OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHJlZ2lvbjogc3RyaW5nO1xuICAvL21hbmlmZXN0QXJ0aWZhY3ROYW1lOiBzdHJpbmc7XG4gIC8vaW1hZ2VBcnRpZmFjdE5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEJ1aWxkU3BlY0dlbmVyYXRvciB7XG4gIHB1YmxpYyBzdGF0aWMgZW1wdHkoKTogQnVpbGRTcGVjR2VuZXJhdG9yIHtcbiAgICByZXR1cm4gbmV3IEJ1aWxkU3BlY0dlbmVyYXRvcih7IHZlcnNpb246ICcwLjInIH0pO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBkZWZhdWx0KHByb3BzOiBEZWZhdWx0QnVpbGRTcGVjUHJvcHMpOiBCdWlsZFNwZWNHZW5lcmF0b3Ige1xuICAgIHJldHVybiBuZXcgQnVpbGRTcGVjR2VuZXJhdG9yKHtcbiAgICAgIHZlcnNpb246ICcwLjInLFxuICAgICAgcGhhc2VzOiB7XG4gICAgICAgIHByZV9idWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnZWNobyBCdWlsZCBzdGFydGVkIG9uIGBkYXRlYCcsXG4gICAgICAgICAgICAnZWNobyBMb2dnaW5nIGluIHRvIEFtYXpvbiBFQ1IuLi4nLFxuICAgICAgICAgICAgJ2F3cyAtLXZlcnNpb24nLFxuICAgICAgICAgICAgYGF3cyBlY3IgZ2V0LWxvZ2luLXBhc3N3b3JkIHwgZG9ja2VyIGxvZ2luIC0tdXNlcm5hbWUgQVdTIC0tcGFzc3dvcmQtc3RkaW4gJHtwcm9wcy5hY2NvdW50fS5ka3IuZWNyLiR7cHJvcHMucmVnaW9ufS5hbWF6b25hd3MuY29tYCxcbiAgICAgICAgICAgICdDT01NSVRfSEFTSD0kKGVjaG8gJENPREVCVUlMRF9SRVNPTFZFRF9TT1VSQ0VfVkVSU0lPTiB8IGN1dCAtYyAxLTcpJyxcbiAgICAgICAgICAgICdJTUFHRV9UQUc9JHtDT01NSVRfSEFTSDo9bGF0ZXN0fScsXG4gICAgICAgICAgICAnZWNobyBSZXBsYWNpbmcgcGxhY2Vob2xkZXIuLi4nLFxuICAgICAgICAgICAgJ3NlZCAtaSBcInN8U0VEX1JFUExBQ0VfRVhFQ1VUSU9OX1JPTEVfQVJOfCRFWEVDVVRJT05fUk9MRV9BUk58Z1wiIHRhc2tkZWYuanNvbicsXG4gICAgICAgICAgICAnc2VkIC1pIFwic3xTRURfUkVQTEFDRV9GQU1JTFl8JEZBTUlMWXxnXCIgdGFza2RlZi5qc29uJyxcbiAgICAgICAgICAgICdlY2hvIEN1cnJlbnQgdGFza0RlZmluaXRpb246JyxcbiAgICAgICAgICAgICdjYXQgdGFza2RlZi5qc29uJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBidWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnZWNobyBCdWlsZGluZyB0aGUgRG9ja2VyIGltYWdlLi4uJyxcbiAgICAgICAgICAgICdkb2NrZXIgdmVyc2lvbicsXG4gICAgICAgICAgICAnZG9ja2VyIGJ1aWxkIC10ICRSRVBPU0lUT1JZX1VSSTpsYXRlc3QgLXQgJFJFUE9TSVRPUllfVVJJOiRJTUFHRV9UQUcgLWYgRG9ja2VyZmlsZSAuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBwb3N0X2J1aWxkOiB7XG4gICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICdlY2hvIFB1c2hpbmcgdGhlIERvY2tlciBpbWFnZXMgdG8gY29udGFpbmVyIHJlZ2lzdHJ5Li4uJyxcbiAgICAgICAgICAgICdkb2NrZXIgcHVzaCAkUkVQT1NJVE9SWV9VUkk6bGF0ZXN0JyxcbiAgICAgICAgICAgICdkb2NrZXIgcHVzaCAkUkVQT1NJVE9SWV9VUkk6JElNQUdFX1RBRycsXG4gICAgICAgICAgICAnZWNobyBXcml0aW5nIGltYWdlIGRlZmluaXRpb25zIGZpbGUuLi4nLFxuICAgICAgICAgICAgJ3ByaW50ZiBcXCd7XCJJbWFnZVVSSVwiOlwiJXNcIn1cXCcgJFJFUE9TSVRPUllfVVJJOiRJTUFHRV9UQUcgPiBpbWFnZURldGFpbC5qc29uJyxcbiAgICAgICAgICAgICdlY2hvIEJ1aWxkIGNvbXBsZXRlZCBvbiBgZGF0ZWAnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgYXJ0aWZhY3RzOiB7XG4gICAgICAgIGZpbGVzOiBbJ2FwcHNwZWMueWFtbCcsICd0YXNrZGVmLmpzb24nXSxcbiAgICAgICAgJ3NlY29uZGFyeS1hcnRpZmFjdHMnOiB7XG4gICAgICAgICAgTWFuaWZlc3RBcnRpZmFjdDoge1xuICAgICAgICAgICAgZmlsZXM6IFsnYXBwc3BlYy55YW1sJywgJ3Rhc2tkZWYuanNvbiddLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSW1hZ2VBcnRpZmFjdDoge1xuICAgICAgICAgICAgZmlsZXM6IFsnaW1hZ2VEZXRhaWwuanNvbiddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHNwZWM6IEJ1aWxkU3BlY1N0cnVjdHVyZSkge31cblxuICBwdWJsaWMgcmVuZGVyKCk6IEJ1aWxkU3BlY1N0cnVjdHVyZSB7XG4gICAgcmV0dXJuIHRoaXMuc3BlYztcbiAgfVxufSJdfQ==