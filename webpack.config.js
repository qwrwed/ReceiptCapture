const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.

  // https://forums.expo.io/t/how-to-fix-local-dev-cors-issues/24512
  if (config.mode === 'development') {
    config.devServer.proxy = {
      '/**': {
        target: {
          host: 'example.com',
          protocol: 'https:',
          port: 443,
        },
        secure: false,
        changeOrigin: true,
        logLevel: 'info',
      },
    };
  }

  return config;
};
