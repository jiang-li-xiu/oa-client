module.exports = {
  presets: [
    ['@vue/app', { useBuiltIns: 'entry' }]
  ],
  plugins: [
    // null判断运算符支持 ??
    '@babel/plugin-proposal-nullish-coalescing-operator',
    // 链判断运算符支持 ?.
    '@babel/plugin-proposal-optional-chaining'
  ]
}
