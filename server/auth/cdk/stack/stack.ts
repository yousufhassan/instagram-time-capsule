import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Code, Runtime, LayerVersion, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PROD_DATABASE_URL } from "../../../env";

export class AuthStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const utilsLayer = new LayerVersion(this, "utils-layer", {
            description: "Contains the node modules for the Node.js app",
            removalPolicy: RemovalPolicy.RETAIN,
            code: Code.fromAsset("../cdk-common/layers/utils"),
        });

        const logicLayer = new LayerVersion(this, "logic-layer", {
            description: "Contains the database and other shared functions file",
            removalPolicy: RemovalPolicy.RETAIN,
            code: Code.fromAsset("../cdk-common/layers/logic"),
            // compatibleArchitectures: [lambda.Architecture.X86_64, lambda.Architecture.ARM_64],
        });

        const createUserLambdaId = "createUserLambda";
        const createUser = new NodejsFunction(this, createUserLambdaId, {
            entry: "../compiled-js/auth/src/routes.js",
            handler: "handler",
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

        // const createUserLambdaId = "createUserLambda";
        // const createUser = new Function(this, createUserLambdaId, {
        //     runtime: Runtime.NODEJS_18_X,
        //     code: Code.fromAsset("../compiled-js/auth/src"), // code loaded from "src" directory
        //     handler: "routes.handler", // file is "routes", function is "handler"

        //     layers: [utilsLayer, logicLayer],
        //     // TODO: how to get this value from .env file and send to lambda config
        // environment: {
        //     DATABASE_URL:
        //         "postgresql://yousuf:wFieLj_dOmD9ToVWJ4rh9Q@blond-beira-2717.g95.cockroachlabs.cloud:26257/instagram-capsule?sslmode=verify-full",
        // },
        //     memorySize: 1024,
        //     timeout: Duration.seconds(10),
        // });

        createUser.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            // TODO: Put the origin in a different general location or at least in a variable
            // TODO: Change to website url once a proper "www" is available
            cors: { allowCredentials: true, allowedOrigins: ["https://*"], allowedHeaders: ["content-type"] },
        });
    }
}
