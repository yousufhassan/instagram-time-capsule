import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Code, FunctionUrlAuthType, LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PROD_DATABASE_URL } from "../../../env";

export class ChatStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // --- LAYERS ---
        const utilsLayer = new LayerVersion(this, "utils-layer", {
            description: "Contains the node modules for the Node.js app",
            removalPolicy: RemovalPolicy.RETAIN,
            code: Code.fromAsset("../cdk-common/layers/utils"),
        });

        const logicLayer = new LayerVersion(this, "logic-layer", {
            description: "Contains the database and other shared functions file",
            removalPolicy: RemovalPolicy.RETAIN,
            code: Code.fromAsset("../cdk-common/layers/logic"),
        });

        // --- GET CHAT LIST ---
        const getChatListLambdaId = "getChatListLambda";
        const getChatList = new NodejsFunction(this, getChatListLambdaId, {
            entry: "src/lambda.ts",
            handler: "getChatListHandler",
            runtime: Runtime.NODEJS_18_X,
            timeout: Duration.seconds(10),
            memorySize: 1024,
            layers: [utilsLayer, logicLayer],
            environment: {
                DATABASE_URL: PROD_DATABASE_URL,
            },
            bundling: {
                externalModules: ["opt/nodejs/database", "opt/nodejs/services"],
            },
        });

        getChatList.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            // TODO: Change to website url once a proper "www" is available
            cors: {
                allowCredentials: true,
                allowedOrigins: ["https://*", "http://192.168.0.23:3000"],
                allowedHeaders: ["content-type"],
            },
        });

        // --- DELETE CHAT ---
        const deleteChatLambdaId = "deleteChatLambda";
        const deleteChat = new NodejsFunction(this, deleteChatLambdaId, {
            entry: "src/lambda.ts",
            handler: "deleteChatHandler",
            runtime: Runtime.NODEJS_18_X,
            timeout: Duration.seconds(10),
            memorySize: 1024,
            layers: [utilsLayer, logicLayer],
            environment: {
                DATABASE_URL: PROD_DATABASE_URL,
            },
            bundling: {
                externalModules: ["opt/nodejs/database", "opt/nodejs/services"],
            },
        });

        deleteChat.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            // TODO: Change to website url once a proper "www" is available
            cors: {
                allowCredentials: true,
                allowedOrigins: ["https://*", "http://192.168.0.23:3000"],
                allowedHeaders: ["content-type"],
            },
        });

        // --- UPLOAD FILES ---
        const uploadFilesLambdaId = "uploadFilesLambda";
        const uploadFiles = new NodejsFunction(this, uploadFilesLambdaId, {
            entry: "src/lambda.ts",
            handler: "uploadFilesHandler",
            runtime: Runtime.NODEJS_18_X,
            timeout: Duration.seconds(120),
            memorySize: 3008,
            layers: [utilsLayer, logicLayer],
            environment: {
                DATABASE_URL: PROD_DATABASE_URL,
            },
            bundling: {
                externalModules: ["opt/nodejs/database", "opt/nodejs/services"],
            },
        });

        uploadFiles.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            // TODO: Change to website url once a proper "www" is available
            cors: {
                allowCredentials: true,
                allowedOrigins: ["https://*", "http://192.168.0.23:3000"],
                allowedHeaders: ["content-type"],
            },
        });
    }
}
