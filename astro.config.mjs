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
            { label: "Getting Stated", slug: "cpp/getting-started" },
            { label: "Basics", slug: "cpp/basics-in-cpp" },
            {
              label: "Basics", items: [
                { label: "Memory model", slug: "cpp/basics/memory-model" },
                { label: "Memory model", slug: "cpp/basics/compilation-stages" },
                {
                  label: "Type Casters",
                  slug: "cpp/basics/advanced-type-casters-in-cpp",
                },
                {
                  label: "Operator Overloading",
                  slug: "cpp/basics/operator-overloading-in-cpp",
                },
                {
                  label: "Shallow Copy and deep copy",
                  slug: "cpp/basics/shallow-copy-deep-copy",
                },
              ]
            },
            {
              label: "Pointers and References",
              items:
                [
                  { label: "Pointers", slug: "cpp/pointers-references/pointers" },
                  { label: "References", slug: "cpp/pointers-references/references" }
                ]
            },
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
            {
              label: "cmake",
              items: [
                { label: "Shared Library", slug: "cpp/cmake/shared-lib" },
                { label: "Static Library", slug: "cpp/cmake/static-lib" },
              ],
            },
          ],
          collapsed: true,
        },
        {
          label: "Cryptography",
          items: [
            {
              label: "Algorithms",
              items: [
                {
                  label: "Symmetric",
                  items: [
                    {
                      label: "AES",
                      slug: "cryptography/algorithms/symmetric/aes"
                    }
                  ]
                },
                {
                  label: "Asymmetric",
                  items: [
                    {
                      label: "RSA overview",
                      slug: "cryptography/algorithms/asymmetric/rsa"
                    },
                    {
                      label: "ECC overview",
                      slug: "cryptography/algorithms/asymmetric/ecc"
                    }
                  ]
                },
                {
                  label: "Misc",
                  items: [
                    {
                      label: "CMS overview",
                      slug: "cryptography/misc/cms"
                    }
                  ]
                },
              ]
            },
            {
              label: "TLS",
              items: [
                {
                  label: "TLS 1.2 Overview",
                  slug: "cryptography/tls/tls_1_2_overview"
                },
                {
                  label: "Cryptography Terms",
                  slug: "cryptography/tls/cryptography_terms"
                },
                {
                  label: "PKI",
                  slug: "cryptography/tls/pki"
                }
              ]
            },
          ],
          collapsed: true,
        },
        {
          label: "Networking",
          items: [
            {
              label: "Firewall",
              items: [
                {
                  label: "iptables",
                  slug: "networking/firewall/iptables"
                }
              ]
            }
          ],
          collapsed: true,
        },
        {
          label: "Linux",
          items: [
            {
              label: "dbus",
              slug: "linux/dbus"
            },
            {
              label: "dbus qa",
              slug: "linux/dbus-qa"
            },
            {
              label: "selinux",
              items: [
                {
                  label: "SE Linux Context",
                  slug: "linux/selinux/selinux"
                }
              ]
            }
          ],
          collapsed: true
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
              collapsed: true,
            },
            {
              label: "Java 8",
              items: [
                {
                  label: "Static and default methods in Interface",
                  slug: "java/java8/static-default-methods-in-interface",
                },
                {
                  label: "Functional interface",
                  slug: "java/java8/functional-interface",
                },
                {
                  label: "Lambda Expressions",
                  slug: "java/java8/lambda-expressions",
                },
              ],
              collapsed: true
            },
            {
              label: "Advanced Java",
              items: [
                {
                  label: "JDBC",
                  slug: "java/advanced-java/jdbc",
                },
                {
                  label: "Servlet",
                  slug: "java/advanced-java/servlet"
                }
              ],
              collapsed: true
            },
          ],
          collapsed: true,
        },
      ],
    }),
  ],
});
