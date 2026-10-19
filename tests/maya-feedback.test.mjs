import test from 'node:test';
import assert from 'node:assert/strict';
import { replyState, safeDiagnostic, failureSummary, latestFailure } from '../components/maya-feedback.mjs';

const conversation = (parts, status = 'completed') => ({
  messages: [
    { id: 'u', role: 'user', metadata: { turnId: 't' }, parts: [{ type: 'text', text: 'private prompt' }] },
    { id: 'a', role: 'assistant', metadata: { turnId: 't', status: 'complete' }, parts },
  ],
  turns: { t: { turnId: 't', status } }, inputs: {}, tasks: {}, agents: {},
});

test('empty and reasoning-only replies are never treated as a delivered answer', () => {
  for (const parts of [[], [{ type: 'reasoning', text: 'private reasoning' }], [{ type: 'text', text: '   ' }]]) {
    assert.equal(replyState(conversation(parts), 'ready'), 'empty');
  }
  assert.equal(replyState(conversation([{ type: 'text', text: 'Resposta' }]), 'ready'), 'answered');
});

test('terminal outcomes and active work remain distinct', () => {
  assert.equal(replyState(conversation([], 'active'), 'ready'), 'working');
  assert.equal(replyState(conversation([], 'failed'), 'ready'), 'failed');
  assert.equal(replyState(conversation([], 'cancelled'), 'ready'), 'cancelled');
  assert.equal(replyState(conversation([{ type: 'authorization', state: 'required' }]), 'ready'), 'pending');
});

test('diagnostic excludes content, credentials, tool payloads and error messages', () => {
  const c = conversation([
    { type: 'reasoning', text: 'private reasoning' },
    { type: 'dynamic-tool', state: 'output-error', input: 'private input', output: 'private output', errorText: 'private secret' },
  ]);
  const result = safeDiagnostic(c, [{ type: 'turn.failed', data: { message: 'private secret', code: 'private code' } }], 'error');
  assert.doesNotMatch(JSON.stringify(result), /private/);
  assert.equal(result.replyState, 'failed');
  assert.equal(result.events[0].failure.code, 'UNCLASSIFIED');
  assert.equal(result.events[0].failure.category, 'unknown');
});

test('classifies model service errors without copying the original error', () => {
  const cases = [
    ['INSUFFICIENT_CREDITS', 'insufficient credits', 'billing_or_quota'],
    ['AUTH_FAILED', 'Invalid API key: private key', 'authentication'],
    ['MODEL_NOT_FOUND', 'Model private-model does not exist', 'model_unavailable'],
    ['RATE_LIMIT', 'Too many requests', 'rate_limit'],
    ['FORBIDDEN', 'Permission denied for private account', 'permission'],
    ['INVALID_ARGUMENT', 'Unsupported reasoning parameter', 'request_configuration'],
    ['TIMEOUT', 'Request timed out', 'timeout'],
    ['CONNECTION_FAILED', 'fetch failed', 'connection'],
    ['WORKFLOW_FAILED', 'workflow resource unavailable', 'infrastructure'],
  ];
  for (const [code, message, expected] of cases) {
    const failure = failureSummary({code, message});
    assert.equal(failure.code, code);
    assert.equal(failure.category, expected);
    assert.doesNotMatch(JSON.stringify(failure), /private/);
  }
});

test('reads a nested status while excluding provider payloads', () => {
  const failure = failureSummary({
    code: 'MODEL_STEP_FAILED', message: 'Model call failed',
    details: { cause: { statusCode: 402, requestBody: 'private prompt', headers: { authorization: 'private token' } } },
  });
  assert.equal(failure.httpStatus, 402);
  assert.equal(failure.category, 'billing_or_quota');
  assert.doesNotMatch(JSON.stringify(failure), /private/);
});

test('keeps a known step cause when the same turn ends with a generic wrapper', () => {
  const events = [
    { type: 'step.failed', data: { turnId: 't', code: 'AUTH_FAILED', message: 'Missing API key' } },
    { type: 'turn.failed', data: { turnId: 't', code: 'TURN_FAILED', message: 'Turn failed' } },
  ];
  assert.equal(latestFailure(events).category, 'authentication');
  assert.equal(latestFailure(events).code, 'AUTH_FAILED');
  assert.equal(latestFailure([]), undefined);
});
