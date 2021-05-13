import { defineConfig } from 'umi';

export default defineConfig({
  outputPath:'../../dist',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  fastRefresh: {},
});
