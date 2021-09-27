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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc3BlYy1nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYnVpbGQtc3BlYy1nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBMENBLE1BQWEsa0JBQWtCO0lBd0Q3QixZQUFxQyxJQUF3QjtRQUF4QixTQUFJLEdBQUosSUFBSSxDQUFvQjtJQUFHLENBQUM7SUF2RDFELE1BQU0sQ0FBQyxLQUFLO1FBQ2pCLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFTSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQTRCO1FBQ2hELE9BQU8sSUFBSSxrQkFBa0IsQ0FBQztZQUM1QixPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRTtnQkFDTixTQUFTLEVBQUU7b0JBQ1QsUUFBUSxFQUFFO3dCQUNSLDhCQUE4Qjt3QkFDOUIsa0NBQWtDO3dCQUNsQyxlQUFlO3dCQUNmLDZFQUE2RSxLQUFLLENBQUMsT0FBTyxZQUFZLEtBQUssQ0FBQyxNQUFNLGdCQUFnQjt3QkFDbEkscUVBQXFFO3dCQUNyRSxrQ0FBa0M7d0JBQ2xDLCtCQUErQjt3QkFDL0IsOEVBQThFO3dCQUM5RSxzREFBc0Q7d0JBQ3RELDhCQUE4Qjt3QkFDOUIsa0JBQWtCO3FCQUNuQjtpQkFDRjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsUUFBUSxFQUFFO3dCQUNSLG1DQUFtQzt3QkFDbkMsZ0JBQWdCO3dCQUNoQixzRkFBc0Y7cUJBQ3ZGO2lCQUNGO2dCQUNELFVBQVUsRUFBRTtvQkFDVixRQUFRLEVBQUU7d0JBQ1IseURBQXlEO3dCQUN6RCxvQ0FBb0M7d0JBQ3BDLHdDQUF3Qzt3QkFDeEMsd0NBQXdDO3dCQUN4Qyw0RUFBNEU7d0JBQzVFLGdDQUFnQztxQkFDakM7aUJBQ0Y7YUFDRjtZQUNELFNBQVMsRUFBRTtnQkFDVCxLQUFLLEVBQUUsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDO2dCQUN2QyxxQkFBcUIsRUFBRTtvQkFDckIsZ0JBQWdCLEVBQUU7d0JBQ2hCLEtBQUssRUFBRSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUM7cUJBQ3hDO29CQUNELGFBQWEsRUFBRTt3QkFDYixLQUFLLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztxQkFDNUI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFJTSxNQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7Q0FDRjtBQTdERCxnREE2REMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIEVudiB7XHJcbiAgcmVhZG9ubHkgdmFyaWFibGVzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcclxuICByZWFkb25seSAncGFyYW1ldGVyLXN0b3JlJz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGhhc2Uge1xyXG4gIHJlYWRvbmx5ICdydW4tYXMnPzogc3RyaW5nO1xyXG4gIHJlYWRvbmx5IGNvbW1hbmRzOiBzdHJpbmdbXTtcclxuICByZWFkb25seSBmaW5hbGx5Pzogc3RyaW5nW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXJ0aWZhY3RzIHtcclxuICByZWFkb25seSBmaWxlcz86IHN0cmluZ1tdO1xyXG4gIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XHJcbiAgcmVhZG9ubHkgJ2Jhc2UtZGlyZWN0b3J5Jz86IHN0cmluZztcclxuICByZWFkb25seSAnZGlzY2FyZC1wYXRocyc/OiAneWVzJyB8ICdubyc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUHJpbWFyeUFydGlmYWN0cyBleHRlbmRzIEFydGlmYWN0cyB7XHJcbiAgcmVhZG9ubHkgJ3NlY29uZGFyeS1hcnRpZmFjdHMnPzogeyBba2V5OiBzdHJpbmddOiBBcnRpZmFjdHMgfTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDYWNoZSB7XHJcbiAgcmVhZG9ubHkgcGF0aHM6IHN0cmluZ1tdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEJ1aWxkU3BlY1N0cnVjdHVyZSB7XHJcbiAgcmVhZG9ubHkgdmVyc2lvbjogJzAuMic7XHJcbiAgcmVhZG9ubHkgJ3J1bi1hcyc/OiBzdHJpbmc7XHJcbiAgcmVhZG9ubHkgZW52PzogRW52O1xyXG4gIHJlYWRvbmx5IHBoYXNlcz86IHsgW2tleTogc3RyaW5nXTogUGhhc2UgfTtcclxuICByZWFkb25seSBhcnRpZmFjdHM/OiBQcmltYXJ5QXJ0aWZhY3RzO1xyXG4gIHJlYWRvbmx5IGNhY2hlPzogQ2FjaGU7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGVmYXVsdEJ1aWxkU3BlY1Byb3BzIHtcclxuICByZWFkb25seSBhY2NvdW50OiBzdHJpbmc7XHJcbiAgcmVhZG9ubHkgcmVnaW9uOiBzdHJpbmc7XHJcbiAgLy9tYW5pZmVzdEFydGlmYWN0TmFtZTogc3RyaW5nO1xyXG4gIC8vaW1hZ2VBcnRpZmFjdE5hbWU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJ1aWxkU3BlY0dlbmVyYXRvciB7XHJcbiAgcHVibGljIHN0YXRpYyBlbXB0eSgpOiBCdWlsZFNwZWNHZW5lcmF0b3Ige1xyXG4gICAgcmV0dXJuIG5ldyBCdWlsZFNwZWNHZW5lcmF0b3IoeyB2ZXJzaW9uOiAnMC4yJyB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZGVmYXVsdChwcm9wczogRGVmYXVsdEJ1aWxkU3BlY1Byb3BzKTogQnVpbGRTcGVjR2VuZXJhdG9yIHtcclxuICAgIHJldHVybiBuZXcgQnVpbGRTcGVjR2VuZXJhdG9yKHtcclxuICAgICAgdmVyc2lvbjogJzAuMicsXHJcbiAgICAgIHBoYXNlczoge1xyXG4gICAgICAgIHByZV9idWlsZDoge1xyXG4gICAgICAgICAgY29tbWFuZHM6IFtcclxuICAgICAgICAgICAgJ2VjaG8gQnVpbGQgc3RhcnRlZCBvbiBgZGF0ZWAnLFxyXG4gICAgICAgICAgICAnZWNobyBMb2dnaW5nIGluIHRvIEFtYXpvbiBFQ1IuLi4nLFxyXG4gICAgICAgICAgICAnYXdzIC0tdmVyc2lvbicsXHJcbiAgICAgICAgICAgIGBhd3MgZWNyIGdldC1sb2dpbi1wYXNzd29yZCB8IGRvY2tlciBsb2dpbiAtLXVzZXJuYW1lIEFXUyAtLXBhc3N3b3JkLXN0ZGluICR7cHJvcHMuYWNjb3VudH0uZGtyLmVjci4ke3Byb3BzLnJlZ2lvbn0uYW1hem9uYXdzLmNvbWAsXHJcbiAgICAgICAgICAgICdDT01NSVRfSEFTSD0kKGVjaG8gJENPREVCVUlMRF9SRVNPTFZFRF9TT1VSQ0VfVkVSU0lPTiB8IGN1dCAtYyAxLTcpJyxcclxuICAgICAgICAgICAgJ0lNQUdFX1RBRz0ke0NPTU1JVF9IQVNIOj1sYXRlc3R9JyxcclxuICAgICAgICAgICAgJ2VjaG8gUmVwbGFjaW5nIHBsYWNlaG9sZGVyLi4uJyxcclxuICAgICAgICAgICAgJ3NlZCAtaSBcInN8U0VEX1JFUExBQ0VfRVhFQ1VUSU9OX1JPTEVfQVJOfCRFWEVDVVRJT05fUk9MRV9BUk58Z1wiIHRhc2tkZWYuanNvbicsXHJcbiAgICAgICAgICAgICdzZWQgLWkgXCJzfFNFRF9SRVBMQUNFX0ZBTUlMWXwkRkFNSUxZfGdcIiB0YXNrZGVmLmpzb24nLFxyXG4gICAgICAgICAgICAnZWNobyBDdXJyZW50IHRhc2tEZWZpbml0aW9uOicsXHJcbiAgICAgICAgICAgICdjYXQgdGFza2RlZi5qc29uJyxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBidWlsZDoge1xyXG4gICAgICAgICAgY29tbWFuZHM6IFtcclxuICAgICAgICAgICAgJ2VjaG8gQnVpbGRpbmcgdGhlIERvY2tlciBpbWFnZS4uLicsXHJcbiAgICAgICAgICAgICdkb2NrZXIgdmVyc2lvbicsXHJcbiAgICAgICAgICAgICdkb2NrZXIgYnVpbGQgLXQgJFJFUE9TSVRPUllfVVJJOmxhdGVzdCAtdCAkUkVQT1NJVE9SWV9VUkk6JElNQUdFX1RBRyAtZiBEb2NrZXJmaWxlIC4nLFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RfYnVpbGQ6IHtcclxuICAgICAgICAgIGNvbW1hbmRzOiBbXHJcbiAgICAgICAgICAgICdlY2hvIFB1c2hpbmcgdGhlIERvY2tlciBpbWFnZXMgdG8gY29udGFpbmVyIHJlZ2lzdHJ5Li4uJyxcclxuICAgICAgICAgICAgJ2RvY2tlciBwdXNoICRSRVBPU0lUT1JZX1VSSTpsYXRlc3QnLFxyXG4gICAgICAgICAgICAnZG9ja2VyIHB1c2ggJFJFUE9TSVRPUllfVVJJOiRJTUFHRV9UQUcnLFxyXG4gICAgICAgICAgICAnZWNobyBXcml0aW5nIGltYWdlIGRlZmluaXRpb25zIGZpbGUuLi4nLFxyXG4gICAgICAgICAgICAncHJpbnRmIFxcJ3tcIkltYWdlVVJJXCI6XCIlc1wifVxcJyAkUkVQT1NJVE9SWV9VUkk6JElNQUdFX1RBRyA+IGltYWdlRGV0YWlsLmpzb24nLFxyXG4gICAgICAgICAgICAnZWNobyBCdWlsZCBjb21wbGV0ZWQgb24gYGRhdGVgJyxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgYXJ0aWZhY3RzOiB7XHJcbiAgICAgICAgZmlsZXM6IFsnYXBwc3BlYy55YW1sJywgJ3Rhc2tkZWYuanNvbiddLFxyXG4gICAgICAgICdzZWNvbmRhcnktYXJ0aWZhY3RzJzoge1xyXG4gICAgICAgICAgTWFuaWZlc3RBcnRpZmFjdDoge1xyXG4gICAgICAgICAgICBmaWxlczogWydhcHBzcGVjLnlhbWwnLCAndGFza2RlZi5qc29uJ10sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgSW1hZ2VBcnRpZmFjdDoge1xyXG4gICAgICAgICAgICBmaWxlczogWydpbWFnZURldGFpbC5qc29uJ10sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBzcGVjOiBCdWlsZFNwZWNTdHJ1Y3R1cmUpIHt9XHJcblxyXG4gIHB1YmxpYyByZW5kZXIoKTogQnVpbGRTcGVjU3RydWN0dXJlIHtcclxuICAgIHJldHVybiB0aGlzLnNwZWM7XHJcbiAgfVxyXG59XHJcbiJdfQ==