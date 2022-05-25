import { defineParameterType } from 'cypress-cucumber-preprocessor/steps';

defineParameterType({
  name: 'object',
  regexp: /\{.*\}/,
  transformer(s) {
    return JSON.parse(s);
  },
});
