function i(e){return e.replace(/-([a-z])/g,(r,n)=>n.toUpperCase())}function t(e){return e===void 0||e===""?e:e.replace(/[\u0300-\u036F]/g,"").trim().replace(/\n{3,}/g,`

`).replace(/[^\S\r\n]{3,}/g,"  ")}export{i as kebabToCamelCase,t as sanitizeString};
//# sourceMappingURL=strings.mjs.map