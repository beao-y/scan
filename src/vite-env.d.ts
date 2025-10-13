/// <reference types="vite/client" />

declare module '*.vue' {

  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module 'lodash-es';

declare module 'dayjs/plugin/utc'
declare module 'dayjs'
