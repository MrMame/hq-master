// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
       // Erzwingt Typdefinitionen, auch wenn sie vom Compiler abgeleitet werden könnten
      "@typescript-eslint/no-inferrable-types": "off", 
      
      // Erzwingt explizite Rückgabetypen bei Funktionen und Methoden
      "@typescript-eslint/explicit-function-return-type": "error", 
      
      // Erzwingt explizite Typen bei Variablen, Properties und Parametern
      "@typescript-eslint/typedef": [
        "error",
        {
          "variableDeclaration": true,       // Korrigiert (vorher variableVariable)
          "memberVariableDeclaration": true, // Für Variablen direkt in einer Klasse/Komponente
          "parameter": true,                 // Für Funktionsparameter
          "propertyDeclaration": true        // Für Properties in Interfaces/Typen
        }
      ],
       // Barrierefreiheits-Prüfungen deaktivieren:
      "@angular-eslint/template/click-events-have-key-events": "off",
      "@angular-eslint/template/interactive-supports-focus": "off",
      "@angular-eslint/template/alt-text": "off",
      "@angular-eslint/template/label-has-associated-control": "off",
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      // Barrierefreiheits-Prüfungen deaktivieren:
      "@angular-eslint/template/click-events-have-key-events": "off",
      "@angular-eslint/template/interactive-supports-focus": "off",
      "@angular-eslint/template/alt-text": "off",
      "@angular-eslint/template/label-has-associated-control": "off",
    },
  },
]);
