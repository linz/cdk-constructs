module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = __webpack_require__(0);
const ecs = new aws_sdk_1.ECS();
const getProperties = (props) => ({
    cluster: props.Cluster,
    serviceName: props.ServiceName,
    containerName: props.ContainerName,
    taskDefinition: props.TaskDefinition,
    launchType: props.LaunchType,
    platformVersion: props.PlatformVersion,
    desiredCount: props.DesiredCount,
    subnets: props.Subnets,
    securityGroups: props.SecurityGroups,
    targetGroupArn: props.TargetGroupArn,
    containerPort: props.ContainerPort,
    schedulingStrategy: props.SchedulingStrategy,
    healthCheckGracePeriodSeconds: props.HealthCheckGracePeriod,
    deploymentConfiguration: props.DeploymentConfiguration,
});
const onCreate = async (event) => {
    const { cluster, serviceName, containerName, taskDefinition, launchType, platformVersion, desiredCount, subnets, securityGroups, targetGroupArn, containerPort, schedulingStrategy, healthCheckGracePeriodSeconds, deploymentConfiguration, } = getProperties(event.ResourceProperties);
    const { service } = await ecs
        .createService({
        cluster,
        serviceName,
        taskDefinition,
        launchType,
        platformVersion,
        desiredCount,
        schedulingStrategy,
        deploymentController: {
            type: 'CODE_DEPLOY',
        },
        networkConfiguration: {
            awsvpcConfiguration: {
                subnets,
                securityGroups,
            },
        },
        deploymentConfiguration,
        healthCheckGracePeriodSeconds,
        loadBalancers: [
            {
                targetGroupArn: targetGroupArn,
                containerPort,
                containerName,
            },
        ],
    })
        .promise();
    if (!service)
        throw Error('Service could not be created');
    return {
        PhysicalResourceId: service.serviceArn,
        Data: {
            ServiceName: service.serviceName,
        },
    };
};
/**
 * For services using the blue/green (CODE_DEPLOY) deployment controller,
 * only the desired count, deployment configuration, task placement constraints
 * and strategies, and health check grace period can be updated using this API.
 * If the network configuration, platform version, or task definition need to be
 * updated, a new AWS CodeDeploy deployment should be created.
 * For more information, see CreateDeployment in the AWS CodeDeploy API Reference.
 */
const onUpdate = async (event) => {
    const { cluster, serviceName, desiredCount, deploymentConfiguration, healthCheckGracePeriodSeconds } = getProperties(event.ResourceProperties);
    const { service } = await ecs
        .updateService({
        service: serviceName,
        cluster,
        desiredCount,
        deploymentConfiguration,
        healthCheckGracePeriodSeconds,
    })
        .promise();
    if (!service)
        throw Error('Service could not be updated');
    return {
        PhysicalResourceId: service.serviceArn,
        Data: {
            ServiceName: service.serviceName,
        },
    };
};
const onDelete = async (event) => {
    const { cluster, serviceName } = getProperties(event.ResourceProperties);
    await ecs
        .deleteService({
        service: serviceName,
        cluster,
        force: true,
    })
        .promise();
    await ecs
        .waitFor('servicesInactive', {
        cluster,
        services: [serviceName],
    })
        .promise();
};
const handler = async (event) => {
    const requestType = event.RequestType;
    switch (requestType) {
        case 'Create':
            return onCreate(event);
        case 'Update':
            return onUpdate(event);
        case 'Delete':
            return onDelete(event);
        default:
            throw new Error(`Invalid request type: ${requestType}`);
    }
};
exports.handler = handler;


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map