const { defaultTheme } = require('@vuepress/theme-default')
const { nprogressPlugin } = require('@vuepress/plugin-nprogress')
const { searchPlugin } = require('@vuepress/plugin-search')
const { googleAnalyticsPlugin } = require('@vuepress/plugin-google-analytics')

module.exports = {
  theme: defaultTheme({
    sidebar: {
      '/': [
          {
            text: '首页',
            children: [
              '/',
            ]
          },
          {
            text: 'kubernetes',
            children: [
              '/kubernetes/debug.md',
            ]
          },
          {
            text: 'spark',
            children: [
              '/spark/streamsource.md'
            ]
          }
      ],
    },
  }),
  plugins: [
    nprogressPlugin(),
    searchPlugin({ hotKeys: '' }),
    googleAnalyticsPlugin({ id: process.env.MEASUREMENTID }),
  ],
}