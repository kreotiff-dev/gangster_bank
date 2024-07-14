module.exports = {
  apps: [
    {
      name: 'gbank_back',
      script: './index.js',
      cwd: '/var/www/gbank/backend',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'gbank_react',
      script: 'npx',
      args: 'serve -s build -l 3001',
      cwd: '/var/www/gbank/frontend',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
