const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      let c = fs.readFileSync(p, 'utf8');
      if (c.includes('from "react-router"') || c.includes("from 'react-router'")) {
        c = c.replace(/from ["']react-router["']/g, "from 'react-router-dom'");
        fs.writeFileSync(p, c);
        console.log('Fixed', p);
      }
    }
  }
}
walk('./src');
