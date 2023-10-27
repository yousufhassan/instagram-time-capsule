import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { AuthStack } from "../stack/stack";

test("SQS Queue and SNS Topic Created", () => {
    const app = new App();
    // WHEN
    const stack = new AuthStack(app, "MyTestStack");
    // THEN

    const template = Template.fromStack(stack);

    template.hasResourceProperties("AWS::SQS::Queue", {
        VisibilityTimeout: 300,
    });
    template.resourceCountIs("AWS::SNS::Topic", 1);
});
