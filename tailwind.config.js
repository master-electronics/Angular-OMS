module.exports = {
  prefix: '',
  purge: {
    enabled: true,
    content: ['./src/**/*.{html,ts}'],
  },
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      opacity: ['disabled', 'active'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
