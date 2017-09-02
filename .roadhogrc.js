const path = require('path')

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, ''),
]

export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  theme: 'src/theme.config.js',
  publicPath: '',
  outputPath: 'publish/management/',
  env: {
      development: {
        extraBabelPlugins: [
          'dva-hmr',
          'transform-runtime',
          ['import', { libraryName: 'antd', style: true }]
        ]
      },
      production: {
        extraBabelPlugins: [
          'transform-runtime',
          ['import', { libraryName: 'antd', style: true}]
        ]
      }
  }
}
