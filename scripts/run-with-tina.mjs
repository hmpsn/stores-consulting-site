import { spawnSync } from 'node:child_process';

const task = process.argv[2];
const commands = {
  build: 'astro build',
  check: 'astro check',
};

if (!commands[task]) {
  console.error('Usage: node scripts/run-with-tina.mjs <build|check>');
  process.exit(2);
}

const clientId = process.env.TINA_PUBLIC_CLIENT_ID || process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
const cloudConfigured = Boolean(clientId && process.env.TINA_TOKEN);
const args = [
  'build',
  cloudConfigured ? '--content=local' : '--local',
  '--noTelemetry',
  ...(cloudConfigured ? [] : ['--skip-cloud-checks']),
  '-c',
  commands[task],
];

const result = spawnSync('tinacms', args, {
  stdio: 'inherit',
  shell: false,
  env: process.env,
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
