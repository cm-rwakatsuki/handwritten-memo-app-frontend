import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as HandwrittenMemoAppFrontend from '../lib/handwritten-memo-app-frontend-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new HandwrittenMemoAppFrontend.HandwrittenMemoAppFrontendStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
