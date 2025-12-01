/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  // 使用 important 选择器限制 Tailwind 只作用于 gopainter-root 容器
  important: '#gopainter-root',
  // 禁用 preflight (base reset)，避免影响全局样式
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
