import { CfnDeploymentConfig } from '@aws-cdk/aws-codedeploy';
import { Construct, IResolvable, Resource } from '@aws-cdk/core';
export interface IEcsDeploymentConfig {
    readonly deploymentConfigName: string;
    readonly deploymentConfigArn: string;
}
export interface EcsDeploymentConfigurationProps {
    /**
     * `AWS::CodeDeploy::DeploymentConfig.DeploymentConfigName`.
     *
     * @external
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html#cfn-codedeploy-deploymentconfig-deploymentconfigname
     */
    readonly deploymentConfigName?: string;
    /**
     * `AWS::CodeDeploy::DeploymentConfig.MinimumHealthyHosts`.
     *
     * @external
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html#cfn-codedeploy-deploymentconfig-minimumhealthyhosts
     */
    readonly minimumHealthyHosts?: CfnDeploymentConfig.MinimumHealthyHostsProperty | IResolvable;
    /**
     * `AWS::CodeDeploy::DeploymentConfig.TrafficRoutingConfig`.
     *
     * @external
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html#cfn-codedeploy-deploymentconfig-trafficroutingconfig
     */
    readonly trafficRoutingConfig?: CfnDeploymentConfig.TrafficRoutingConfigProperty | IResolvable;
}
export declare class EcsDeploymentConfig extends Resource implements IEcsDeploymentConfig {
    static readonly LINEAR_10PERCENT_EVERY_1MINUTE: IEcsDeploymentConfig;
    static readonly LINEAR_10PERCENT_EVERY_3MINUTES: IEcsDeploymentConfig;
    static readonly CANARY_10PERCENT_5MINUTES: IEcsDeploymentConfig;
    static readonly CANARY_10PERCENT_15MINUTES: IEcsDeploymentConfig;
    static readonly ALL_AT_ONCE: IEcsDeploymentConfig;
    /**
     * Import a custom Deployment Configuration for an ECS Deployment Group defined outside the CDK.
     *
     * @param _scope the parent Construct for this new Construct
     * @param _id the logical ID of this new Construct
     * @param ecsDeploymentConfigName the name of the referenced custom Deployment Configuration
     * @returns a Construct representing a reference to an existing custom Deployment Configuration
     */
    static fromEcsDeploymentConfigName(_scope: Construct, _id: string, ecsDeploymentConfigName: string): IEcsDeploymentConfig;
    readonly deploymentConfigName: string;
    readonly deploymentConfigArn: string;
    constructor(scope: Construct, id: string, props: EcsDeploymentConfigurationProps);
}
