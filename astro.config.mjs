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
            { label: "Getting Started", slug: "cpp/getting-started" },
            {
              label: "Basics",
              items: [
                { label: "Memory model", slug: "cpp/basics/memory-model" },
                { label: "Compilation stages", slug: "cpp/basics/compilation-stages" },
                { label: "Bitwise Operators", slug: "cpp/basics/bitwise-operators" },
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
              ],
              collapsed: true
            },
            {
              label: "Pointers and References",
              items:
                [
                  { label: "Pointers", slug: "cpp/pointers-references/pointers" },
                  { label: "References", slug: "cpp/pointers-references/references" }
                ],
              collapsed: true
            },
            {
              label: "Oops",
              items: [
                { label: "Oops", slug: "cpp/oops/oops-in-cpp" },
                { label: "Inheritance", slug: "cpp/oops/inheritance-in-cpp" },
                { label: "Polymorphism", slug: "cpp/oops/polymorphism-in-cpp" },
                { label: "Rule of five, three, zero", slug: "cpp/oops/rules-of-five-three-zero" },
                {
                  label: "Aggregation and composition",
                  slug: "cpp/oops/aggregation-composition",
                },
              ],
              collapsed: true
            },
            {
              label: "CPP 11",
              items: [
                { label: "Type Inference", slug: "cpp/cpp-11/type-inference" },
                {
                  label: "Lambda Functions",
                  slug: "cpp/cpp-11/lambda-functions",
                },
                {
                  label: "Smart pointers",
                  slug: "cpp/cpp-11/smart-pointers",
                },
                {
                  label: "Multithreading",
                  slug: "cpp/cpp-11/multi-threading"
                }
              ],
              collapsed: true
            },
            {
              label: "Design Patterns & Principles",
              items: [
                { label: "SOLID principles", slug: "cpp/deisgn-patterns-principles/solid-principles" },
              ],
              collapsed: true
            },
            {
              label: "cmake",
              items: [
                { label: "Shared Library", slug: "cpp/cmake/shared-lib" },
                { label: "Static Library", slug: "cpp/cmake/static-lib" },
              ],
              collapsed: true
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
                    },
                    {
                      label: "Diffie-Hellman",
                      slug: "cryptography/misc/diffie-hellman"
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
                  label: "TLS 1.3 Overview",
                  slug: "cryptography/tls/tls_1_3"
                },
                {
                  label: "Cryptography Terms",
                  slug: "cryptography/tls/cryptography_terms"
                },
                {
                  label: "TLS version diff",
                  slug: "cryptography/tls/tls_version_diff"
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
                  items: [
                    {
                      label: "Firewall Basics",
                      slug: "networking/firewall/iptables/basics"
                    },
                    {
                      label: "Chain Traversal Order",
                      slug: "networking/firewall/iptables/chain_traversal_order"
                    },
                    {
                      label: "Iptables Commands",
                      slug: "networking/firewall/iptables/commands"
                    },
                    {
                      label: "Basic Matches",
                      slug: "networking/firewall/iptables/basic-matches"
                    },
                    {
                      label: "Advanced Matches",
                      slug: "networking/firewall/iptables/advanced-matches"
                    },
                    {
                      label: "ipset",
                      slug: "networking/firewall/iptables/ipset"
                    }, 
                    {
                      label: "Targets",
                      slug: "networking/firewall/iptables/targets"
                    }, 
                    {
                      label: "nmap",
                      slug: "networking/firewall/iptables/nmap"
                    }, {
                      label: "NAT",
                      slug: "networking/firewall/iptables/nat"
                    }, 
                    {
                      label: "User Defined Chains",
                      slug: "networking/firewall/iptables/user_defined"
                    },
                    {
                      label: "Challenges",
                      slug: "networking/firewall/iptables/challenges"
                    },
                  ],
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
                },
                {
                  label: "Policy Creation",
                  slug: "linux/selinux/policy_creation"
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
