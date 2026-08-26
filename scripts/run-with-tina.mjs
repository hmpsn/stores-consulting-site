import { spawnSync } from 'node:child_process';

const task = process.argv[2];
const commands = {
  dev: 'astro dev',
  build: 'astro build',
  check: 'astro check',
};

if (!commands[task]) {
  console.error('Usage: node scripts/run-with-tina.mjs <dev|build|check> [Astro arguments]');
  process.exit(2);
}

const quote = (value) => `'${value.replaceAll("'", "'\\''")}'`;
const baseCommand = [commands[task], ...process.argv.slice(3).map(quote)].join(' ');
const astroCommand = task === 'dev' ? `${baseCommand} && astro dev logs --follow` : baseCommand;

const clientId = process.env.TINA_PUBLIC_CLIENT_ID || process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
const cloudConfigured = Boolean(clientId && process.env.TINA_TOKEN);
const args = [
  task === 'dev' ? 'dev' : 'build',
  ...(task === 'dev' ? [] : [cloudConfigured ? '--content=local' : '--local']),
  '--noTelemetry',
  ...(task === 'dev' || cloudConfigured ? [] : ['--skip-cloud-checks']),
  '-c',
  astroCommand,
];

const result = spawnSync('tinacms', args, {
  stdio: 'inherit',
  shell: false,
  env: process.env,
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
