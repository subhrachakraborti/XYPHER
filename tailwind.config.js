module.exports = {
darkMode: 'class',
content: [
'./app/**/*.{js,jsx,ts,tsx}',
'./components/**/*.{js,jsx,ts,tsx}',
],
theme: {
extend: {
colors: {
brand: {
50: '#f3f6ff',
100: '#e7edff',
200: '#c6d2ff',
300: '#9fb2ff',
400: '#7a93ff',
500: '#5f79fb',
600: '#475ee7',
700: '#3548c4',
800: '#2a3899',
900: '#232f78',
}
},
boxShadow: {
glow: '0 0 40px rgba(95, 121, 251, 0.2)'
}
},
},
plugins: [],
};