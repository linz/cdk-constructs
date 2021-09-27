"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
const ecs = new aws_sdk_1.ECS();
const getProperties = (props) => ({
    family: props.Family,
    image: props.Image,
    executionRoleArn: props.ExecutionRoleArn,
    networkMode: props.NetworkMode,
    containerName: props.ContainerName,
    containerPort: props.ContainerPort,
});
const onCreate = async (event) => {
    const { family, image, executionRoleArn, networkMode, containerName, containerPort } = getProperties(event.ResourceProperties);
    const { taskDefinition } = await ecs
        .registerTaskDefinition({
        requiresCompatibilities: ['FARGATE'],
        family,
        executionRoleArn,
        networkMode,
        cpu: '256',
        memory: '512',
        containerDefinitions: [
            {
                name: containerName,
                image,
                portMappings: [
                    {
                        hostPort: containerPort,
                        protocol: 'tcp',
                        containerPort: containerPort,
                    },
                ],
            },
        ],
    })
        .promise();
    if (!taskDefinition)
        throw Error('Taskdefinition could not be registerd');
    return {
        PhysicalResourceId: taskDefinition.taskDefinitionArn,
    };
};
const onDelete = async (event) => {
    const taskDefinition = event.PhysicalResourceId;
    await ecs
        .deregisterTaskDefinition({
        taskDefinition,
    })
        .promise();
};
exports.handler = async (event) => {
    const requestType = event.RequestType;
    switch (requestType) {
        case 'Create':
            return onCreate(event);
        case 'Update':
            // CodeDeploy is responsible for updates on the TaskDefinition
            return;
        case 'Delete':
            return onDelete(event);
        default:
            throw new Error(`Invalid request type: ${requestType}`);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGFtYmRhcy9kdW1teS10YXNrLWRlZmluaXRpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscUNBQThCO0FBZTlCLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxLQUE4RCxFQUEwQixFQUFFLENBQUMsQ0FBQztJQUNqSCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07SUFDcEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO0lBQ2xCLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7SUFDeEMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO0lBQzlCLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtJQUNsQyxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7Q0FDbkMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxRQUFRLEdBQUcsS0FBSyxFQUFFLEtBQThDLEVBQTBCLEVBQUU7SUFDaEcsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFFL0gsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLE1BQU0sR0FBRztTQUNqQyxzQkFBc0IsQ0FBQztRQUN0Qix1QkFBdUIsRUFBRSxDQUFDLFNBQVMsQ0FBQztRQUNwQyxNQUFNO1FBQ04sZ0JBQWdCO1FBQ2hCLFdBQVc7UUFDWCxHQUFHLEVBQUUsS0FBSztRQUNWLE1BQU0sRUFBRSxLQUFLO1FBQ2Isb0JBQW9CLEVBQUU7WUFDcEI7Z0JBQ0UsSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLEtBQUs7Z0JBQ0wsWUFBWSxFQUFFO29CQUNaO3dCQUNFLFFBQVEsRUFBRSxhQUFhO3dCQUN2QixRQUFRLEVBQUUsS0FBSzt3QkFDZixhQUFhLEVBQUUsYUFBYTtxQkFDN0I7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztTQUNELE9BQU8sRUFBRSxDQUFDO0lBRWIsSUFBSSxDQUFDLGNBQWM7UUFBRSxNQUFNLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0lBRTFFLE9BQU87UUFDTCxrQkFBa0IsRUFBRSxjQUFjLENBQUMsaUJBQTJCO0tBQy9ELENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixNQUFNLFFBQVEsR0FBRyxLQUFLLEVBQUUsS0FBOEMsRUFBaUIsRUFBRTtJQUN2RixNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUM7SUFFaEQsTUFBTSxHQUFHO1NBQ04sd0JBQXdCLENBQUM7UUFDeEIsY0FBYztLQUNmLENBQUM7U0FDRCxPQUFPLEVBQUUsQ0FBQztBQUNmLENBQUMsQ0FBQztBQUVXLFFBQUEsT0FBTyxHQUFHLEtBQUssRUFBRSxLQUF3QyxFQUFpQyxFQUFFO0lBQ3ZHLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7SUFFdEMsUUFBUSxXQUFXLEVBQUU7UUFDbkIsS0FBSyxRQUFRO1lBQ1gsT0FBTyxRQUFRLENBQUMsS0FBZ0QsQ0FBQyxDQUFDO1FBQ3BFLEtBQUssUUFBUTtZQUNYLDhEQUE4RDtZQUM5RCxPQUFPO1FBQ1QsS0FBSyxRQUFRO1lBQ1gsT0FBTyxRQUFRLENBQUMsS0FBZ0QsQ0FBQyxDQUFDO1FBQ3BFO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsV0FBVyxFQUFFLENBQUMsQ0FBQztLQUMzRDtBQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50LCBDbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlQ3JlYXRlRXZlbnQsIENsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VEZWxldGVFdmVudCB9IGZyb20gJ2F3cy1sYW1iZGEnO1xyXG5pbXBvcnQgeyBFQ1MgfSBmcm9tICdhd3Mtc2RrJztcclxuXHJcbmludGVyZmFjZSBIYW5kbGVyUmV0dXJuIHtcclxuICBQaHlzaWNhbFJlc291cmNlSWQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFY3NUYXNrRGVmaW5pdGlvblByb3BzIHtcclxuICBmYW1pbHk6IHN0cmluZztcclxuICBpbWFnZTogc3RyaW5nO1xyXG4gIGV4ZWN1dGlvblJvbGVBcm46IHN0cmluZztcclxuICBuZXR3b3JrTW9kZTogc3RyaW5nO1xyXG4gIGNvbnRhaW5lck5hbWU6IHN0cmluZztcclxuICBjb250YWluZXJQb3J0OiBudW1iZXI7XHJcbn1cclxuXHJcbmNvbnN0IGVjcyA9IG5ldyBFQ1MoKTtcclxuXHJcbmNvbnN0IGdldFByb3BlcnRpZXMgPSAocHJvcHM6IENsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudFsnUmVzb3VyY2VQcm9wZXJ0aWVzJ10pOiBFY3NUYXNrRGVmaW5pdGlvblByb3BzID0+ICh7XHJcbiAgZmFtaWx5OiBwcm9wcy5GYW1pbHksXHJcbiAgaW1hZ2U6IHByb3BzLkltYWdlLFxyXG4gIGV4ZWN1dGlvblJvbGVBcm46IHByb3BzLkV4ZWN1dGlvblJvbGVBcm4sXHJcbiAgbmV0d29ya01vZGU6IHByb3BzLk5ldHdvcmtNb2RlLFxyXG4gIGNvbnRhaW5lck5hbWU6IHByb3BzLkNvbnRhaW5lck5hbWUsXHJcbiAgY29udGFpbmVyUG9ydDogcHJvcHMuQ29udGFpbmVyUG9ydCxcclxufSk7XHJcblxyXG5jb25zdCBvbkNyZWF0ZSA9IGFzeW5jIChldmVudDogQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUNyZWF0ZUV2ZW50KTogUHJvbWlzZTxIYW5kbGVyUmV0dXJuPiA9PiB7XHJcbiAgY29uc3QgeyBmYW1pbHksIGltYWdlLCBleGVjdXRpb25Sb2xlQXJuLCBuZXR3b3JrTW9kZSwgY29udGFpbmVyTmFtZSwgY29udGFpbmVyUG9ydCB9ID0gZ2V0UHJvcGVydGllcyhldmVudC5SZXNvdXJjZVByb3BlcnRpZXMpO1xyXG5cclxuICBjb25zdCB7IHRhc2tEZWZpbml0aW9uIH0gPSBhd2FpdCBlY3NcclxuICAgIC5yZWdpc3RlclRhc2tEZWZpbml0aW9uKHtcclxuICAgICAgcmVxdWlyZXNDb21wYXRpYmlsaXRpZXM6IFsnRkFSR0FURSddLFxyXG4gICAgICBmYW1pbHksXHJcbiAgICAgIGV4ZWN1dGlvblJvbGVBcm4sXHJcbiAgICAgIG5ldHdvcmtNb2RlLFxyXG4gICAgICBjcHU6ICcyNTYnLFxyXG4gICAgICBtZW1vcnk6ICc1MTInLFxyXG4gICAgICBjb250YWluZXJEZWZpbml0aW9uczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IGNvbnRhaW5lck5hbWUsXHJcbiAgICAgICAgICBpbWFnZSxcclxuICAgICAgICAgIHBvcnRNYXBwaW5nczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaG9zdFBvcnQ6IGNvbnRhaW5lclBvcnQsXHJcbiAgICAgICAgICAgICAgcHJvdG9jb2w6ICd0Y3AnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IGNvbnRhaW5lclBvcnQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9KVxyXG4gICAgLnByb21pc2UoKTtcclxuXHJcbiAgaWYgKCF0YXNrRGVmaW5pdGlvbikgdGhyb3cgRXJyb3IoJ1Rhc2tkZWZpbml0aW9uIGNvdWxkIG5vdCBiZSByZWdpc3RlcmQnKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogdGFza0RlZmluaXRpb24udGFza0RlZmluaXRpb25Bcm4gYXMgc3RyaW5nLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBvbkRlbGV0ZSA9IGFzeW5jIChldmVudDogQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZURlbGV0ZUV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgY29uc3QgdGFza0RlZmluaXRpb24gPSBldmVudC5QaHlzaWNhbFJlc291cmNlSWQ7XHJcblxyXG4gIGF3YWl0IGVjc1xyXG4gICAgLmRlcmVnaXN0ZXJUYXNrRGVmaW5pdGlvbih7XHJcbiAgICAgIHRhc2tEZWZpbml0aW9uLFxyXG4gICAgfSlcclxuICAgIC5wcm9taXNlKCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaGFuZGxlciA9IGFzeW5jIChldmVudDogQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KTogUHJvbWlzZTxIYW5kbGVyUmV0dXJuIHwgdm9pZD4gPT4ge1xyXG4gIGNvbnN0IHJlcXVlc3RUeXBlID0gZXZlbnQuUmVxdWVzdFR5cGU7XHJcblxyXG4gIHN3aXRjaCAocmVxdWVzdFR5cGUpIHtcclxuICAgIGNhc2UgJ0NyZWF0ZSc6XHJcbiAgICAgIHJldHVybiBvbkNyZWF0ZShldmVudCBhcyBDbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlQ3JlYXRlRXZlbnQpO1xyXG4gICAgY2FzZSAnVXBkYXRlJzpcclxuICAgICAgLy8gQ29kZURlcGxveSBpcyByZXNwb25zaWJsZSBmb3IgdXBkYXRlcyBvbiB0aGUgVGFza0RlZmluaXRpb25cclxuICAgICAgcmV0dXJuO1xyXG4gICAgY2FzZSAnRGVsZXRlJzpcclxuICAgICAgcmV0dXJuIG9uRGVsZXRlKGV2ZW50IGFzIENsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VEZWxldGVFdmVudCk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcmVxdWVzdCB0eXBlOiAke3JlcXVlc3RUeXBlfWApO1xyXG4gIH1cclxufTtcclxuIl19