#!/usr/bin/env node

/**
 * CSS Validation Script
 * Validates CSS files for syntax errors and shows detailed error information
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import postcssImport from 'postcss-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

/**
 * Format error with colors and context
 */
function formatError(error, filePath) {
  const lines = [];

  // Header
  lines.push('');
  lines.push(`${colors.red}${colors.bright}✗ CSS Syntax Error${colors.reset}`);
  lines.push(
    `${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );

  // File path
  const relativePath = path.relative(rootDir, filePath);
  lines.push(`${colors.cyan}File:${colors.reset} ${relativePath}`);

  // Error message
  if (error.message) {
    lines.push(`${colors.red}Error:${colors.reset} ${error.message}`);
  }

  // Line and column
  if (error.line !== undefined) {
    lines.push(`${colors.yellow}Line:${colors.reset} ${error.line}`);
  }
  if (error.column !== undefined) {
    lines.push(`${colors.yellow}Column:${colors.reset} ${error.column}`);
  }

  // Source code context
  if (error.line && fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileLines = fileContent.split('\n');
      const errorLine = error.line - 1; // Convert to 0-based index

      if (errorLine >= 0 && errorLine < fileLines.length) {
        lines.push('');
        lines.push(`${colors.gray}Context:${colors.reset}`);
        lines.push(
          `${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
        );

        // Show 3 lines before and after error
        const startLine = Math.max(0, errorLine - 3);
        const endLine = Math.min(fileLines.length - 1, errorLine + 3);

        for (let i = startLine; i <= endLine; i++) {
          const lineNum = (i + 1).toString().padStart(4, ' ');
          const lineContent = fileLines[i];

          if (i === errorLine) {
            // Highlight error line
            let highlighted = lineContent;
            if (error.column !== undefined) {
              const col = error.column - 1;
              if (col >= 0 && col < lineContent.length) {
                const before = lineContent.substring(0, col);
                const char = lineContent[col];
                const after = lineContent.substring(col + 1);
                highlighted = `${before}${colors.bright}${colors.red}${char}${colors.reset}${after}`;
              }
            }
            lines.push(
              `${colors.red}${colors.bright}${lineNum} │${colors.reset} ${highlighted}`
            );

            // Show caret pointing to error
            if (error.column !== undefined) {
              const caret =
                ' '.repeat(error.column + 6) +
                colors.red +
                colors.bright +
                '^' +
                colors.reset;
              lines.push(caret);
            }
          } else {
            lines.push(
              `${colors.gray}${lineNum} │${colors.reset} ${lineContent}`
            );
          }
        }
      }
    } catch (readError) {
      // Ignore read errors
    }
  }

  // Error details
  if (error.reason) {
    lines.push('');
    lines.push(`${colors.yellow}Reason:${colors.reset} ${error.reason}`);
  }

  if (error.showSourceCode && error.source) {
    lines.push('');
    lines.push(`${colors.gray}Source:${colors.reset}`);
    lines.push(`${colors.gray}${error.source}${colors.reset}`);
  }

  // Show block issues if available
  if (error.blockIssues && error.blockIssues.length > 0) {
    lines.push('');
    lines.push(`${colors.yellow}Additional Issues Found:${colors.reset}`);
    error.blockIssues.forEach((issue) => {
      lines.push(`  ${colors.red}•${colors.reset} ${issue.message}`);
      if (issue.line) {
        lines.push(
          `    ${colors.gray}At line ${issue.line}, column ${issue.column || 1}${colors.reset}`
        );
      }
    });
  }

  // Show context for unclosed blocks
  if (error.type === 'unclosed_block' && error.context) {
    lines.push('');
    lines.push(`${colors.yellow}Block Context:${colors.reset}`);
    lines.push(`${colors.gray}${error.context}${colors.reset}`);
  }

  // Suggestions
  if (error.type === 'unclosed_block') {
    lines.push('');
    lines.push(`${colors.cyan}Suggestion:${colors.reset}`);
    lines.push(
      `  Check for missing closing brace '}' after line ${error.line || 'the error location'}`
    );
    lines.push(
      `  Ensure all @media queries, @keyframes, and rule blocks are properly closed`
    );
  }

  if (error.type === 'extra_closing_brace') {
    lines.push('');
    lines.push(`${colors.cyan}Suggestion:${colors.reset}`);
    lines.push(
      `  Remove the extra closing brace '}' or add a matching opening brace '{'`
    );
  }

  lines.push('');
  lines.push(
    `${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );
  lines.push('');

  return lines.join('\n');
}

/**
 * Check for unclosed blocks in CSS
 */
function checkUnclosedBlocks(css, filePath) {
  const lines = css.split('\n');
  const issues = [];
  let openBraces = 0;
  let lastOpenLine = 0;
  let lastOpenChar = '';

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const beforeBraces = openBraces;

    // Count braces (ignoring those in strings/comments)
    let inString = false;
    let inComment = false;
    let commentType = ''; // '//' or '/*'

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      // Check for comments
      if (!inString && !inComment) {
        if (char === '/' && nextChar === '/') {
          break; // Single-line comment
        }
        if (char === '/' && nextChar === '*') {
          inComment = true;
          commentType = '/*';
          i++; // Skip next char
          continue;
        }
      }

      if (inComment && commentType === '/*') {
        if (char === '*' && nextChar === '/') {
          inComment = false;
          commentType = '';
          i++; // Skip next char
          continue;
        }
      }

      // Check for strings
      if (!inComment && (char === '"' || char === "'")) {
        if (!inString) {
          inString = char;
        } else if (inString === char && line[i - 1] !== '\\') {
          inString = false;
        }
        continue;
      }

      // Count braces only outside strings and comments
      if (!inString && !inComment) {
        if (char === '{') {
          openBraces++;
          lastOpenLine = lineNum;
          lastOpenChar = line.substring(Math.max(0, i - 20), i + 21);
        } else if (char === '}') {
          openBraces--;
          if (openBraces < 0) {
            issues.push({
              type: 'extra_closing_brace',
              line: lineNum,
              column: i + 1,
              message: `Extra closing brace '}' at line ${lineNum}, column ${i + 1}`,
            });
            openBraces = 0; // Reset to continue checking
          }
        }
      }
    }

    // Check for unbalanced braces at end of file
    if (index === lines.length - 1 && openBraces > 0) {
      issues.push({
        type: 'unclosed_block',
        line: lastOpenLine,
        column: 1,
        message: `Unclosed block starting at line ${lastOpenLine}. ${openBraces} opening brace(s) not closed.`,
        context: lastOpenChar,
      });
    }
  });

  return issues;
}

/**
 * Validate a single CSS file
 */
async function validateCSSFile(filePath) {
  try {
    const css = fs.readFileSync(filePath, 'utf8');

    // First, check for unclosed blocks
    const blockIssues = checkUnclosedBlocks(css, filePath);
    if (blockIssues.length > 0) {
      return {
        success: false,
        filePath,
        error: blockIssues[0], // Return first issue
      };
    }

    // Use PostCSS to parse and validate
    await postcss([
      postcssImport({
        root: path.dirname(filePath),
      }),
    ]).process(css, {
      from: filePath,
      map: { inline: false },
    });

    return { success: true, filePath };
  } catch (error) {
    // Extract file path from error if available
    let errorFilePath = filePath;
    if (error.name === 'CssSyntaxError' && error.file) {
      errorFilePath = error.file;
    }

    // Enhance error with unclosed block check
    let blockIssues = [];
    try {
      const css = fs.readFileSync(errorFilePath, 'utf8');
      blockIssues = checkUnclosedBlocks(css, errorFilePath);
    } catch (readError) {
      // Ignore read errors
    }

    return {
      success: false,
      filePath: errorFilePath,
      error: {
        message: error.message || 'Unknown error',
        line: error.line,
        column: error.column,
        reason: error.reason,
        showSourceCode: error.showSourceCode,
        source: error.source,
        blockIssues: blockIssues.length > 0 ? blockIssues : undefined,
      },
    };
  }
}

/**
 * Find all CSS files in a directory
 */
function findCSSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .git, dist, etc.
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        findCSSFiles(filePath, fileList);
      }
    } else if (file.endsWith('.css')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Main validation function
 */
async function main() {
  const args = process.argv.slice(2);

  // If file path provided, validate that file
  let cssFiles = [];
  if (args.length > 0) {
    const filePath = path.resolve(rootDir, args[0]);
    if (fs.existsSync(filePath)) {
      cssFiles = [filePath];
    } else {
      console.error(
        `${colors.red}Error: File not found: ${args[0]}${colors.reset}`
      );
      process.exit(1);
    }
  } else {
    // Validate all CSS files in components/admin/styles
    const adminStylesDir = path.join(rootDir, 'components', 'admin', 'styles');
    if (fs.existsSync(adminStylesDir)) {
      cssFiles = findCSSFiles(adminStylesDir);
    }

    // Also check root styles directory
    const stylesDir = path.join(rootDir, 'styles');
    if (fs.existsSync(stylesDir)) {
      cssFiles = cssFiles.concat(findCSSFiles(stylesDir));
    }

    // Check shared styles
    const sharedStylesDir = path.join(rootDir, 'shared', 'styles');
    if (fs.existsSync(sharedStylesDir)) {
      cssFiles = cssFiles.concat(findCSSFiles(sharedStylesDir));
    }
  }

  if (cssFiles.length === 0) {
    console.log(
      `${colors.yellow}No CSS files found to validate.${colors.reset}`
    );
    process.exit(0);
  }

  console.log(
    `${colors.blue}Validating ${cssFiles.length} CSS file(s)...${colors.reset}\n`
  );

  const results = await Promise.all(
    cssFiles.map((file) => validateCSSFile(file))
  );

  const errors = results.filter((r) => !r.success);
  const successes = results.filter((r) => r.success);

  // Print results
  if (errors.length > 0) {
    console.log(
      `${colors.red}${colors.bright}Found ${errors.length} error(s):${colors.reset}\n`
    );

    errors.forEach((result) => {
      console.log(formatError(result.error, result.filePath));
    });

    console.log(
      `${colors.red}${colors.bright}✗ Validation failed${colors.reset}\n`
    );
    process.exit(1);
  } else {
    console.log(
      `${colors.green}${colors.bright}✓ All ${successes.length} file(s) validated successfully${colors.reset}\n`
    );
    process.exit(0);
  }
}

// Run validation
main().catch((error) => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
});
