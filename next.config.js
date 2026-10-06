const { configureRuntimeEnv } = require('next-runtime-env/build/configure');

configureRuntimeEnv();

module.exports = {
  images: {
    domains: ['retaildemo.ncrvoyixcloud.com', 'https://via.placeholder.com', 'via.placeholder.com', 'www.google.com', 'localhost']
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};
