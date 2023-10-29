import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Code, Runtime, LayerVersion, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PROD_DATABASE_URL } from "../../../env";

export class AuthStack extends Stack {
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

        // --- CREATE USER ---
        const createUserLambdaId = "createUserLambda";
        const createUser = new NodejsFunction(this, createUserLambdaId, {
            entry: "src/lambda.ts",
            handler: "createUserHandler",
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

        createUser.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            // TODO: Change to website url once a proper "www" is available
            cors: { allowCredentials: true, allowedOrigins: ["https://*"], allowedHeaders: ["content-type"] },
        });

        // --- LOGIN ---
        const loginLambdaId = "loginLambda";
        const login = new NodejsFunction(this, loginLambdaId, {
            entry: "src/lambda.ts",
            handler: "loginHandler",
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

        login.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            // TODO: Change to website url once a proper "www" is available
            cors: { allowCredentials: true, allowedOrigins: ["https://*"], allowedHeaders: ["content-type"] },
        });
    }
}
