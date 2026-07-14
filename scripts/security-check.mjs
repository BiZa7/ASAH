import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const srcDir = join(root, 'src');

const ignoredDirs = new Set(['node_modules', 'dist', 'coverage', '.git']);
const scannedExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.html']);

const patternChecks = [
  {
    name: 'Legacy hardcoded production API URL',
    regex: /raspy-annemarie/i,
  },
  {
    name: 'Committed OpenAI API key',
    regex: /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/,
  },
  {
    name: 'Committed Google API key',
    regex: /AIza[0-9A-Za-z_-]{20,}/,
  },
  {
    name: 'Backend-only secret referenced in frontend source',
    regex: /\b(OPENAI_API_KEY|JWT_SECRET|JWT_REFRESH_SECRET|DATABASE_URL|GEMINI_API_KEY)\b/,
  },
  {
    name: 'Unsafe inline HTML rendering',
    regex: /dangerouslySetInnerHTML/,
  },
  {
    name: 'Dynamic code execution',
    regex: /\beval\s*\(|new\s+Function\s*\(/,
  },
  {
    name: 'Leftover debug logging',
    regex: /console\.log\(/,
  },
];

function extensionOf(path) {
  const index = path.lastIndexOf('.');
  return index === -1 ? '' : path.slice(index);
}

function walk(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!ignoredDirs.has(entry)) {
        files.push(...walk(fullPath));
      }
      continue;
    }

    if (scannedExtensions.has(extensionOf(entry))) {
      files.push(fullPath);
    }
  }

  return files;
}

const violations = [];

if (!existsSync(srcDir)) {
  violations.push('src directory was not found.');
} else {
  for (const file of walk(srcDir)) {
    const content = readFileSync(file, 'utf8');
    const displayPath = relative(root, file);

    for (const check of patternChecks) {
      if (check.regex.test(content)) {
        violations.push(`${displayPath}: ${check.name}`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error('Security check failed:');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('Security check passed.');
