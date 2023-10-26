import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Code, Function, Runtime, LayerVersion, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import { config } from "dotenv";
config();

export class AuthStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const utilsLayer = new LayerVersion(this, "utils-layer", {
            description: "Contains the node modules for the Node.js app",
            removalPolicy: RemovalPolicy.RETAIN,
            code: Code.fromAsset("../cdk-common/layers/utils"),
        });

        // const logicLayer = new LayerVersion(this, "logic-layer", {
        //     description: "Contains the app.js file",
        //     removalPolicy: RemovalPolicy.RETAIN,
        //     code: Code.fromAsset("../cdk-common/layers/business-logic"),
        //     // compatibleArchitectures: [lambda.Architecture.X86_64, lambda.Architecture.ARM_64],
        // });

        const createUserLambdaId = "createUserLambda";
        const createUser = new Function(this, createUserLambdaId, {
            runtime: Runtime.NODEJS_18_X,
            code: Code.fromAsset("../compiled-js/auth/src"), // code loaded from "src" directory
            handler: "routes.handler", // file is "routes", function is "handler"
            layers: [utilsLayer],
            environment: { DATABASE_URL: process.env.DATABASE_URL! },
            memorySize: 1024,
            timeout: Duration.seconds(10),
        });

        createUser.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            // TODO: Put the origin in a different general location or at least in a variable
            // TODO: Change to website url once a proper "www" is available
            cors: { allowCredentials: true, allowedOrigins: ["https://*"], allowedHeaders: ["content-type"] },
        });
    }
}
