#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { ConversationStack } from "./stack";

const app = new App();
new ConversationStack(app, "ConversationStack");
