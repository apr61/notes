import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Notes',
			social: {
				github: 'https://github.com/apr61',
			},
			sidebar: [
				{
					label: 'CPP',
					items: [
						{ label: 'Basics', slug: 'cpp/basics-in-cpp'},
						{ label: 'Pointers', slug: 'cpp/pointers-in-cpp' },
						{
							label: 'Oops',
							items: [
								{ label: 'Oops', slug: 'cpp/oops/oops-in-cpp' },
								{ label: 'Inheritance', slug: 'cpp/oops/inheritance-in-cpp' },
								{ label: 'Polymorphism', slug: 'cpp/oops/polymorphism-in-cpp' },
								{ label: 'Aggregation and composition', slug: 'cpp/oops/aggregation-composition' },
							]
						},
						{ label: 'Advanced Type Casters', slug: 'cpp/advanced-type-casters-in-cpp' },
						{ label: 'Opeartor Overloading', slug: 'cpp/operator-overloading-in-cpp' },
						{ label: 'Type Inference', slug: 'cpp/type-inference-in-cpp' },
						{ label: 'Shallow Copy and deep copy', slug: 'cpp/shallow-copy-deep-copy' },
						{
							label: 'CPP 11',
							items: [
								{ label: 'Reference', slug: 'cpp/cpp-11/reference' },
								{ label: 'Type Inference', slug: 'cpp/cpp-11/type-inference' },
								{ label: 'Lambda Functions', slug: 'cpp/cpp-11/lambda-functions' },
							]
						},
					],
				},
				{
					label: 'JavaScript',
					items: [
						{ label: 'Code execution', slug: 'javascript/exection-of-code' },
						{ label: 'Hoisting', slug: 'javascript/hoisting' },
						{ label: 'var vs let vs const', slug: 'javascript/var-let-const' },
						{ label: 'Closures', slug: 'javascript/closures' },
						{ label: 'Functions', slug: 'javascript/functions' },
						{ label: 'Event loop', slug: 'javascript/eventloop' },
						{ label: 'JS Engine', slug: 'javascript/js-engine' },
						{ label: 'Higher Order Functions', slug: 'javascript/higher-order-functions' },
						{ label: 'Promises', slug: 'javascript/promises-in-js' },
						{ label: 'Async Await', slug: 'javascript/async-js' },
					],
				},
			],
		}),
	],
});
