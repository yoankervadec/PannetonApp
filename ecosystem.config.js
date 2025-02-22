//
// ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "panneton-server",
      script: "npm",
      args: "run dev",
      cwd: "./server",
      watch: true,
      env: {
        NODE_ENV: "development",
        PORT: 8080,
      },
    },
    {
      name: "panneton-client",
      script: "npm",
      args: "run dev",
      cwd: "./client",
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 3300,
      },
    },
  ],
};
