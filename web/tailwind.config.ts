import type {Config} from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      container: {
        padding: '2rem',
        center: true,
      },
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
  },
}
