#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { ChatStack } from "./stack";

const app = new App();
new ChatStack(app, "ChatStack");
