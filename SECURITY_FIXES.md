# Security Vulnerability Fixes

Resolved 25 vulnerabilities (4 critical, 9 high, 12 moderate) flagged by GitHub Dependabot.

## Direct Dependency Updates

| Package | Before | After | Severity | Advisory |
|---|---|---|---|---|
| `axios` | `^1.8.3` | `^1.15.0` | Critical | [GHSA-3p68-rc4w-qgx5](https://github.com/advisories/GHSA-3p68-rc4w-qgx5) — SSRF via NO_PROXY hostname normalization bypass |
| `next` | `^15.3.6` | `^15.5.15` | High | [GHSA-ggv3-7p47-pfv8](https://github.com/advisories/GHSA-ggv3-7p47-pfv8), [GHSA-3x4c-7xq6-9pq8](https://github.com/advisories/GHSA-3x4c-7xq6-9pq8), [GHSA-q4gf-8mx6-v5v3](https://github.com/advisories/GHSA-q4gf-8mx6-v5v3) — HTTP smuggling, disk cache DoS, Server Components DoS |
| `drizzle-orm` | `^0.40.1` | `^0.45.2` | High | [GHSA-gpj5-g38j-94v9](https://github.com/advisories/GHSA-gpj5-g38j-94v9) — SQL injection via improperly escaped identifiers |
| `jspdf` | `^3.0.1` | `^4.2.1` | Critical | [GHSA-f8cm-6447-x5h2](https://github.com/advisories/GHSA-f8cm-6447-x5h2) and 9 more — LFI/path traversal, PDF injection, XSS, DoS |

### LangChain Ecosystem Upgrade (coordinated)

`@langchain/community@1.1.27` requires `@langchain/core@^1.1.38`, which forced a coordinated upgrade of all LangChain packages from `0.x` to `1.x`.

| Package | Before | After | Severity | Advisory |
|---|---|---|---|---|
| `@langchain/community` | `^1.1.15` | `^1.1.27` | Moderate | [GHSA-mphv-75cg-56wg](https://github.com/advisories/GHSA-mphv-75cg-56wg) — SSRF via RecursiveUrlLoader redirect chaining |
| `@langchain/core` | `^0.3.66` | `^1.1.39` | High | [GHSA-r399-636x-v7f6](https://github.com/advisories/GHSA-r399-636x-v7f6) — Serialization injection enables secret extraction |
| `langchain` | `^0.3.30` | `^1.3.1` | High | [GHSA-r399-636x-v7f6](https://github.com/advisories/GHSA-r399-636x-v7f6) — Serialization injection |
| `@langchain/anthropic` | `^0.3.24` | `^1.3.26` | — | Required for `@langchain/core@1.x` compatibility |
| `@langchain/google-genai` | `^0.2.15` | `^2.1.26` | — | Required for `@langchain/core@1.x` compatibility |
| `@langchain/groq` | `^0.2.3` | `^1.2.0` | — | Required for `@langchain/core@1.x` compatibility |
| `@langchain/ollama` | `^0.2.3` | `^1.2.6` | — | Required for `@langchain/core@1.x` compatibility |
| `@langchain/openai` | `^0.6.2` | `^1.4.4` | — | Required for `@langchain/core@1.x` compatibility |
| `@langchain/textsplitters` | `^0.1.0` | `^1.0.1` | — | Required for `@langchain/core@1.x` compatibility |
| `drizzle-kit` (dev) | `^0.31.9` | `^0.31.10` | — | Patch bump |

## Transitive Dependency Overrides

These packages are pulled in transitively and were pinned via npm `overrides`.

| Package | Minimum safe version | Severity | Advisory |
|---|---|---|---|
| `@xmldom/xmldom` | `>=0.8.12` | High | [GHSA-wh4c-j3r5-mjhp](https://github.com/advisories/GHSA-wh4c-j3r5-mjhp) — XML injection via unsafe CDATA |
| `ajv` | `>=6.14.0` | Moderate | [GHSA-2g4f-4pwh-qvx6](https://github.com/advisories/GHSA-2g4f-4pwh-qvx6) — ReDoS via `$data` option |
| `brace-expansion` | `>=1.1.13` | Moderate | [GHSA-f886-m6hf-6m8v](https://github.com/advisories/GHSA-f886-m6hf-6m8v) — Zero-step sequence DoS |
| `dompurify` | `>=3.3.2` | Moderate | [GHSA-v8jm-5vwx-cfxm](https://github.com/advisories/GHSA-v8jm-5vwx-cfxm) and 4 more — XSS, mutation-XSS, prototype pollution |
| `esbuild` | `>=0.25.0` | Moderate | [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99) — Dev server allows cross-origin requests |
| `fast-xml-parser` | `>=4.5.5` | Critical | [GHSA-m7jm-9gc2-mpf2](https://github.com/advisories/GHSA-m7jm-9gc2-mpf2) and 4 more — Entity expansion DoS, regex injection, stack overflow |
| `file-type` | `>=21.4.0` | Moderate | [GHSA-5v7r-6r5c-r473](https://github.com/advisories/GHSA-5v7r-6r5c-r473) — Infinite loop in ASF parser |
| `flatted` | `>=3.4.2` | High | [GHSA-25h7-pfq9-p65f](https://github.com/advisories/GHSA-25h7-pfq9-p65f), [GHSA-rf6f-7fwh-wjgh](https://github.com/advisories/GHSA-rf6f-7fwh-wjgh) — Unbounded recursion DoS, prototype pollution |
| `handlebars` | `4.7.9` | High | [GHSA-xhpv-hc6g-r9c6](https://github.com/advisories/GHSA-xhpv-hc6g-r9c6), [GHSA-9cx6-37pm-9jff](https://github.com/advisories/GHSA-9cx6-37pm-9jff) — Object injection, malformed decorator DoS |
| `langsmith` | `>=0.5.0` | Moderate | [GHSA-v34v-rq6j-cj6p](https://github.com/advisories/GHSA-v34v-rq6j-cj6p) — SSRF via tracing header injection |
| `minimatch` | `>=9.0.7` | High | [GHSA-3ppc-4f35-3m26](https://github.com/advisories/GHSA-3ppc-4f35-3m26) and 2 more — ReDoS via repeated wildcards |
| `picomatch` | `>=4.0.4` | High | [GHSA-3v7f-55p6-f55p](https://github.com/advisories/GHSA-3v7f-55p6-f55p), [GHSA-c2c7-rcm5-vvqj](https://github.com/advisories/GHSA-c2c7-rcm5-vvqj) — Method injection, ReDoS via extglob |
| `underscore` | `>=1.13.8` | High | [GHSA-qpx9-hpmf-5gmw](https://github.com/advisories/GHSA-qpx9-hpmf-5gmw) — Unlimited recursion DoS in `_.flatten`/`_.isEqual` |
| `yaml` | `>=2.8.3` | Moderate | [GHSA-48c2-rrv3-qjmp](https://github.com/advisories/GHSA-48c2-rrv3-qjmp) — Stack overflow via deeply nested YAML |

## Result

```
found 0 vulnerabilities
```
