import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const pipeline = readFileSync(new URL('../Jenkinsfile', import.meta.url), 'utf8');

test('main builds and updates IaC even when the latest commit is empty or documentation-only', () => {
  assert.match(pipeline, /stage\('Build & Push Image'\)[\s\S]*?when\s*\{\s*expression\s*\{\s*!skipCi\s*&&\s*isDeployable\s*\}\s*\}/);
  assert.match(pipeline, /stage\('Update IaC'\)[\s\S]*?when\s*\{\s*expression\s*\{\s*!skipCi\s*&&\s*isDeployable\s*\}\s*\}/);
});
