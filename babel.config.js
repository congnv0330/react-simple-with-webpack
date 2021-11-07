module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'entry',
      corejs: 3,
      exclude: ['transform-typeof-symbol']
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }]
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', {
      loose: true
    }],
    ['@babel/plugin-proposal-private-methods', {
      loose: true
    }],
    ['@babel/plugin-proposal-private-property-in-object', {
      loose: true
    }],
    ['babel-plugin-transform-react-remove-prop-types', {
      removeImport: true
    }],
    ['@babel/plugin-transform-runtime', {
      regenerator: true
    }]
  ]
}
