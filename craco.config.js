/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
// craco.config.js
module.exports = {
	style: {
		postcss: {
			plugins: [require('tailwindcss'), require('autoprefixer')],
		},
	},
};
