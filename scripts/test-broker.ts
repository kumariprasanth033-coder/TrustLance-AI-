/**
 * TrustLance AI — CLI Automated Test Runner
 * Executes all 20 Workflow Tests and 11 Security Tests in Node/CLI environment
 */

// Polyfill localStorage for CLI environment
if (typeof globalThis.localStorage === 'undefined') {
  const memoryStore: Record<string, string> = {};
  (globalThis as any).localStorage = {
    getItem: (key: string) => memoryStore[key] ?? null,
    setItem: (key: string, val: string) => { memoryStore[key] = String(val); },
    removeItem: (key: string) => { delete memoryStore[key]; },
    clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]); }
  };
}

import { automatedTestsApi } from '../src/services/aiBroker';
import { initLocalDatabase } from '../src/services/api';

async function main() {
  console.log('============================================================');
  console.log('TRUSTLANCE AI — AI BROKER & SECURITY AUTOMATED TEST SUITE');
  console.log('============================================================');
  console.log('Initializing relational database simulation...\n');
  initLocalDatabase();

  const { results, summary } = await automatedTestsApi.runAllTests((current, total, item) => {
    const symbol = item.status === 'PASSED' ? '\x1b[32m✔ PASS\x1b[0m' : '\x1b[31m✖ FAIL\x1b[0m';
    const num = `[${current.toString().padStart(2, '0')}/${total}]`;
    console.log(`${symbol} ${num} ${item.title} (${item.duration_ms}ms)`);
    if (item.status === 'FAILED') {
      console.log(`       \x1b[31mError: ${item.message}\x1b[0m`);
    }
  });

  console.log('\n============================================================');
  console.log(`TEST SUMMARY: ${summary.passed}/${summary.total} PASSED (${summary.success_rate}%) in ${summary.duration_ms}ms`);
  console.log('============================================================');

  if (summary.failed > 0) {
    console.error(`\x1b[31m${summary.failed} tests failed!\x1b[0m`);
    process.exit(1);
  } else {
    console.log('\x1b[32mAll 31 AI Broker Workflow & Security Invariants PASSED.\x1b[0m');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
