import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Code, Function, Runtime, LayerVersion, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";

export class AuthStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // @ts-ignore
        const utilsLayer = new LayerVersion(this, "utils-layer", {
            removalPolicy: RemovalPolicy.RETAIN,
            code: Code.fromAsset("../cdk-common/layers/utils"),
            // compatibleArchitectures: [lambda.Architecture.X86_64, lambda.Architecture.ARM_64],
        });

        const createUserLambdaId = "createUserLambda";
        // @ts-ignore
        const createUser = new Function(this, createUserLambdaId, {
            runtime: Runtime.NODEJS_18_X,
            code: Code.fromAsset("../compiled-js/auth/src"), // code loaded from "src" directory
            handler: "routes.handler", // file is "routes", function is "handler"
            layers: [utilsLayer],
        });

        createUser.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            // TODO: Put the origin in a different general location or at least in a variable
            // TODO: Change to website url once a proper "www" is available
            cors: { allowCredentials: true, allowedOrigins: ["https://*"] },
        });
    }
}
