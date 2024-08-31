import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Notes",
      social: {
        github: "https://github.com/apr61",
      },
      sidebar: [
        {
          label: "CPP",
          items: [
            { label: "Basics", slug: "cpp/basics-in-cpp" },
            { label: "Pointers", slug: "cpp/pointers-in-cpp" },
            {
              label: "Oops",
              items: [
                { label: "Oops", slug: "cpp/oops/oops-in-cpp" },
                { label: "Inheritance", slug: "cpp/oops/inheritance-in-cpp" },
                { label: "Polymorphism", slug: "cpp/oops/polymorphism-in-cpp" },
                {
                  label: "Aggregation and composition",
                  slug: "cpp/oops/aggregation-composition",
                },
              ],
            },
            {
              label: "Advanced Type Casters",
              slug: "cpp/advanced-type-casters-in-cpp",
            },
            {
              label: "Opeartor Overloading",
              slug: "cpp/operator-overloading-in-cpp",
            },
            { label: "Type Inference", slug: "cpp/type-inference-in-cpp" },
            {
              label: "Shallow Copy and deep copy",
              slug: "cpp/shallow-copy-deep-copy",
            },
            {
              label: "CPP 11",
              items: [
                { label: "Reference", slug: "cpp/cpp-11/reference" },
                { label: "Type Inference", slug: "cpp/cpp-11/type-inference" },
                {
                  label: "Lambda Functions",
                  slug: "cpp/cpp-11/lambda-functions",
                },
              ],
            },
          ],
          collapsed: true,
        },
        {
          label: "JavaScript",
          items: [
            { label: "Code execution", slug: "javascript/exection-of-code" },
            { label: "Hoisting", slug: "javascript/hoisting" },
            { label: "var vs let vs const", slug: "javascript/var-let-const" },
            { label: "Closures", slug: "javascript/closures" },
            { label: "Functions", slug: "javascript/functions" },
            { label: "Event loop", slug: "javascript/eventloop" },
            { label: "JS Engine", slug: "javascript/js-engine" },
            {
              label: "Higher Order Functions",
              slug: "javascript/higher-order-functions",
            },
            { label: "Promises", slug: "javascript/promises-in-js" },
            { label: "Async Await", slug: "javascript/async-js" },
          ],
          collapsed: true,
        },
        {
          label: "Java",
          items: [
            {
              label: "Getting started with Java",
              slug: "java/getting-started",
            },
            {
              label: "Collection Framework",
              items: [
                {
                  label: "What is collection framework",
                  slug: "java/collections-framework/what-is-collection-framework",
                },
                {
                  label: "Wrapper classes",
                  slug: "java/collections-framework/wrapper-classes",
                },
                {
                  label: "Generics",
                  slug: "java/collections-framework/generics",
                },
                {
                  label: "ArrayList",
                  slug: "java/collections-framework/arraylist",
                },
                {
                  label: "Vector Collection",
                  slug: "java/collections-framework/vector-collection",
                },
                { label: "Stack", slug: "java/collections-framework/stack" },
                {
                  label: "Linked List",
                  slug: "java/collections-framework/linked-list",
                },
                { label: "Set", slug: "java/collections-framework/set" },
                { label: "Map", slug: "java/collections-framework/map" },
                {
                  label: "Comparator",
                  slug: "java/collections-framework/comparator",
                },
              ],
			  collapsed: true
            },
            {
              label: "Java 8",
			  items: [
				{
					label: "Static and default methods in Interface",
					slug: "java/java8/static-default-methods-in-interface"
				}
			  ]
            },
          ],
          collapsed: true,
        },
      ],
    }),
  ],
});
