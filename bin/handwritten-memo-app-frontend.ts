#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HandwrittenMemoAppFrontendStack } from '../lib/handwritten-memo-app-frontend-stack';

const app = new cdk.App();
new HandwrittenMemoAppFrontendStack(app, 'HandwrittenMemoAppFrontendStack');
