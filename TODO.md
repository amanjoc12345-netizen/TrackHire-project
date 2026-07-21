# Fix Questions Endpoint JSON Parsing

## Steps

- [x] 1. Plan approved
- [x] 2. Fix `sanitizeJSONResponse()` in `server/services/aiService.js` — rewritten as `extractFirstJSON()` with depth-counting JSON extractor
- [x] 3. Update retry prompt in `generateJSON()` to require `{`/`[` first and `}`/`]` last
- [x] 4. Update prompt in `server/routes/questions.js` — added strict JSON requirements block
- [x] 5. Update prompt in `server/routes/mock.js` — added strict JSON requirements (categories + evaluate) + used `extractFirstJSON`
- [x] 6. Update prompt in `server/routes/analyze.js` — added strict JSON requirements block
- [x] 7. Update prompt in `server/routes/insights.js` — added strict JSON requirements block
- [x] 8. Update prompt in `server/routes/roadmap.js` — added strict JSON requirements block
- [x] 9. Update prompt in `server/routes/resources.js` — added strict JSON requirements block
- [x] 10. All changes applied successfully

