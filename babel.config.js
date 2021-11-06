module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-proposal-class-properties'
  ]
}
