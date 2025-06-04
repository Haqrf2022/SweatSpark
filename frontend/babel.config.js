module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            constants: './frontend/constants',
            hooks: './frontend/hooks',
            components: './frontend/components',
            supabase: './supabase',
          },
        },
      ],
    ],
  };
};
