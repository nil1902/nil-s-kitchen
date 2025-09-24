// Simple script to check for common React/TypeScript errors
const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'src/components/checkout/PaymentOptions.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/home/HeroBanner.tsx',
  'src/components/menu/MenuPage.tsx',
  'src/components/gallery/GalleryPage.tsx'
];

console.log('🔍 Checking for common errors...\n');

filesToCheck.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`✅ ${filePath}:`);
    
    // Check for common issues
    const issues = [];
    
    // Check for character encoding issues
    if (content.includes('�')) {
      issues.push('⚠️  Character encoding issues detected');
    }
    
    // Check for typos in common words
    if (content.includes('DELIVERTY')) {
      issues.push('⚠️  Typo: DELIVERTY should be DELIVERY');
    }
    
    // Check for invalid className combinations
    if (content.includes('md:size')) {
      issues.push('⚠️  Invalid Tailwind class: md:size is not valid');
    }
    
    // Check for missing closing braces
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    
    if (Math.abs(openBraces - closeBraces) > 5) {
      issues.push('⚠️  Potential missing braces (large imbalance detected)');
    }
    
    if (issues.length === 0) {
      console.log('   No major issues found');
    } else {
      issues.forEach(issue => console.log(`   ${issue}`));
    }
    
  } catch (error) {
    console.log(`❌ ${filePath}: Error reading file - ${error.message}`);
  }
  
  console.log('');
});

console.log('🎉 Error check completed!');