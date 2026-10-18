import test from 'node:test';
import assert from 'node:assert/strict';
import { replyState, safeDiagnostic } from '../components/maya-feedback.mjs';

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
  assert.deepEqual(result.events, [{ type: 'turn.failed' }]);
});
