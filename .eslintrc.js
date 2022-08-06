module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    // 解构对象，而不使用
    "no-unused-vars": ["error", { ignoreRestSiblings: true }],
    // 组件/实例的选项的顺序
    "vue/order-in-components": [
      "error",
      {
        order: [
          "el",
          "name",
          "parent",
          "functional",
          ["delimiters", "comments"],
          ["components", "directives", "filters"],
          "extends",
          "mixins",
          "inheritAttrs",
          "model",
          ["props", "propsData"],
          "data",
          "computed",
          "watch",
          "LIFECYCLE_HOOKS",
          "methods",
          ["template", "render"],
          "renderError",
        ],
      },
    ],
    // vue 属性顺序
    "vue/attributes-order": [
      "error",
      {
        order: [
          "DEFINITION",
          "LIST_RENDERING",
          "CONDITIONALS",
          "RENDER_MODIFIERS",
          "GLOBAL",
          "UNIQUE",
          "TWO_WAY_BINDING",
          "OTHER_DIRECTIVES",
          "OTHER_ATTR",
          "EVENTS",
          "CONTENT",
        ],
      },
    ],
    // 组件名称必须是大驼峰
    // "vue/name-property-casing": ["error", "PascalCase"],
    // vue Html元素单标签关闭方式
    "vue/html-self-closing": [
      "error",
      {
        html: { normal: "never", void: "always" },
        svg: "always",
        math: "always",
      },
    ],
    //必须使用全等
    eqeqeq: 2,
    // 允许直接修改方法参数
    "require-atomic-updates": 0,
  },
};
