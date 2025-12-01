const ts = require('typescript');
const config = { moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ESNext, allowSyntheticDefaultImports:true, allowImportingTsExtensions:false, baseUrl: 'C:/fwv-calculators', paths: {'@/*': ['*']} };
const res = ts.resolveModuleName('lucide-react', 'C:/fwv-calculators/components/example.tsx', config, ts.sys);
console.log(JSON.stringify(res, null, 2));
