#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

/**
 * Extract test scenarios from Playwright spec files.
 * Looks for test('[TEST-XXX] description', ...) patterns.
 */
async function extractTests(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    const testPattern = /test\(['"`]\[([^\]]+)\]\s*([^'"`]+)['"`]/g;
    const tests = [];
    
    let match;
    let lineNum = 1;
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      testPattern.lastIndex = 0; // Reset regex
      
      if ((match = testPattern.exec(line)) !== null) {
        const [, testId, description] = match;
        tests.push({
          id: testId,
          description: description.trim(),
          file: relative(rootDir, filePath),
          line: i + 1
        });
      }
    }
    
    return tests;
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}: ${error.message}`);
    return [];
  }
}

/**
 * Recursively find all .spec.ts files in the projects directory.
 */
async function findSpecFiles(dir) {
  const files = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...await findSpecFiles(fullPath));
      } else if (entry.name.endsWith('.spec.ts')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory might not exist, ignore
  }
  
  return files;
}

/**
 * Group tests by project (based on directory structure).
 */
function groupTestsByProject(tests) {
  const projects = {};
  
  for (const test of tests) {
    // Determine project from path pattern
    let project = 'unknown';
    
    if (test.file.includes('\\smoke\\') || test.file.includes('/smoke/')) {
      project = 'myapp-smoke';
    } else if (test.file.includes('\\regression\\') || test.file.includes('/regression/')) {
      project = 'myapp-regression';
    } else if (test.file.includes('\\manual\\') || test.file.includes('/manual/')) {
      project = 'myapp-manual';
    }
    
    if (!projects[project]) {
      projects[project] = [];
    }
    
    projects[project].push(test);
  }
  
  return projects;
}

/**
 * Main execution function.
 */
async function main() {
  const projectsDir = join(rootDir, 'projects');
  const specFiles = await findSpecFiles(projectsDir);
  
  if (specFiles.length === 0) {
    console.log('No test files found.');
    return;
  }
  
  // Extract all tests
  const allTests = [];
  for (const file of specFiles) {
    const tests = await extractTests(file);
    allTests.push(...tests);
  }
  
  // Group by project
  const projectGroups = groupTestsByProject(allTests);
  
  // Display results
  let totalTests = 0;
  const projectNames = Object.keys(projectGroups).sort();
  
  for (const project of projectNames) {
    const tests = projectGroups[project];
    console.log(`\\n■ ${project}  (${tests.length})`);
    
    // Sort tests by ID
    tests.sort((a, b) => {
      // Extract numeric part of test ID for proper sorting
      const aNum = parseInt(a.id.replace('TEST-', '')) || 0;
      const bNum = parseInt(b.id.replace('TEST-', '')) || 0;
      return aNum - bNum;
    });
    
    for (const test of tests) {
      console.log(`  ${test.id}  ${test.description}  ›  ${test.file}:${test.line}`);
    }
    
    totalTests += tests.length;
  }
  
  console.log(`\\nTotal: ${totalTests} scenarios across ${projectNames.length} project(s).`);
}

// Run the script
main().catch(console.error);