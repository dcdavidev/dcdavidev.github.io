import spellbookx from 'eslint-plugin-spellbookx';

export default [
	...spellbookx.configs['recommended-astro'],
	{
		rules: {
			'@eslint-react/no-missing-key': 'off',
		},
	},
];
