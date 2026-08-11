const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace next/link with react-router-dom Link
  content = content.replace(/import\s+Link\s+from\s+["']next\/link["'];?/g, 'import { Link } from "react-router-dom";');
  
  // Replace next/navigation with react-router-dom hooks
  content = content.replace(/import\s+\{\s*usePathname\s*\}\s+from\s+["']next\/navigation["'];?/g, 'import { useLocation } from "react-router-dom";');
  
  // Replace next-auth/react with custom AuthContext
  content = content.replace(/import\s+\{\s*useSession([^}]*)\}\s+from\s+["']next-auth\/react["'];?/g, 'import { useSession } from "../../context/AuthContext";');
  content = content.replace(/import\s+\{\s*signIn([^}]*)\}\s+from\s+["']next-auth\/react["'];?/g, 'import { useSession } from "../../context/AuthContext";');

  // Replace next/image with img
  content = content.replace(/import\s+Image\s+from\s+["']next\/image["'];?/g, '');
  content = content.replace(/<Image/g, '<img');

  // Handle 'use client'
  content = content.replace(/"use client";?\n?/g, '');
  content = content.replace(/'use client';?\n?/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src', 'pages'));
walkDir(path.join(__dirname, 'src', 'components'));
