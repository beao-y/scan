import type { ConfigEnv } from 'vite'
import path from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd())

  return {
    base: env.VITE_APP_ROUTER,
    root: process.cwd(),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5175,
      open: true,
      hmr: true,
      proxy: {
        [env.VITE_BASEURL]: {
          target: env.VITE_BASE_API,
          ws: true,
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp(`^${env.VITE_BASEURL}`), ''),
        },
      },
    },
    // 构建
    build: {
      chunkSizeWarningLimit: 2000, // 消除打包大小超过500kb警告
      outDir: 'dist', // 指定打包路径，默认为项目根目录下的dist目录
      minify: 'esbuild', // Vite 2.6.x 以上需要配置 minify："terser"，terserOptions才能生效
      terserOptions: {
        compress: {
          keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          drop_console: true, // 生产环境去除 console
          drop_debugger: true, // 生产环境去除 debugger
        },
        format: {
          comments: false, // 删除注释
        },
      },
      // 静态资源打包到dist下的不同目录
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    // 引入sass全局样式变量
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api', 'import'], // 关掉警告
          additionalData: `@import "@/style/variable.scss";`,
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      tailwindcss(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg/')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      AutoImport({
        imports: ['vue', 'pinia', '@vueuse/core', 'vue-router'],
        // 如有用到eslint记得加上写段，没有用到可以忽略
        eslintrc: {
          enabled: true,
          globalsPropValue: true,
        },
      }),
    ],
  }
})
