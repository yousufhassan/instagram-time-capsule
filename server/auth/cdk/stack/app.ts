#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { AuthStack } from "./stack";

const app = new App();
new AuthStack(app, "AuthStack");
