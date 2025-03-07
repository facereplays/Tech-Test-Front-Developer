module.exports = {
  externals: {
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  },
 resolve: {
    preferAbsolute: false,
  },
  module:{
  loaders: [
    {
      test: /\.glsl$/,
      loader: 'webpack-glsl'
    }
  ]}
};
