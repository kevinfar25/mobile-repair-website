const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function closePopups(page) {
  console.log('Checking for and closing pop-ups...');
  
  // Common selectors for various types of pop-ups
  const popupSelectors = [
    // Cookie banners
    '[data-testid="cookie-banner"] button',
    '.cookie-banner button',
    '#cookie-banner button',
    '.cookie-consent button',
    '[aria-label*="Accept"]',
    '[aria-label*="Close"]',
    'button[data-dismiss="modal"]',
    '.modal-close',
    '.close',
    '.btn-close',
    // Newsletter/promotional pop-ups
    '.newsletter-popup .close',
    '.promo-popup .close',
    '.popup-close',
    '[data-testid="close-button"]',
    '[data-testid="modal-close"]',
    // Generic close buttons
    'button:has-text("Close")',
    'button:has-text("Accept")',
    'button:has-text("Got it")',
    'button:has-text("OK")',
    'button:has-text("Dismiss")',
    '.fa-times', // Font Awesome close icons
    '.fa-close'
  ];
  
  // Try to close each type of popup
  for (const selector of popupSelectors) {
    try {
      const element = await page.locator(selector).first();
      if (await element.isVisible({ timeout: 2000 })) {
        console.log(`Found popup with selector: ${selector}`);
        await element.click();
        await page.waitForTimeout(1000); // Wait for animation
        console.log(`Closed popup: ${selector}`);
      }
    } catch (error) {
      // Selector not found, continue to next one
    }
  }
  
  // Press Escape key to close any remaining modals
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
  
  console.log('Pop-up handling complete.');
}

async function takeReferenceScreenshots(browser) {
  console.log('\n=== TAKING REFERENCE WEBSITE SCREENSHOTS ===');
  
  const page = await browser.newPage();
  
  // Set viewport size for consistent screenshots
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  console.log('Navigating to Liverpool FC website...');
  await page.goto('https://www.liverpoolfc.com/', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  // Wait for page to load completely
  await page.waitForLoadState('networkidle');
  
  // Handle pop-ups before taking screenshots
  await closePopups(page);
  
  // Wait a moment for any animations to finish
  await page.waitForTimeout(3000);
  
  // Create timestamp for file naming
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  
  // Take desktop screenshots
  console.log('Taking desktop reference screenshots...');
  await page.screenshot({ 
    path: `reference-desktop-full-${timestamp}.png`, 
    fullPage: true 
  });
  
  await page.screenshot({ 
    path: `reference-desktop-viewport-${timestamp}.png`
  });
  
  // Take mobile viewport screenshots
  console.log('Taking mobile reference screenshots...');
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
  await page.waitForTimeout(2000);
  
  await page.screenshot({ 
    path: `reference-mobile-full-${timestamp}.png`, 
    fullPage: true 
  });
  
  await page.screenshot({ 
    path: `reference-mobile-viewport-${timestamp}.png`
  });
  
  await page.close();
  console.log('Reference screenshots completed!');
  
  return timestamp;
}

async function takeGeneratedSiteScreenshots(browser, timestamp) {
  console.log('\n=== TAKING GENERATED WEBSITE SCREENSHOTS ===');
  
  const page = await browser.newPage();
  
  // Get the absolute path to the index.html file
  const indexPath = path.resolve(__dirname, 'index.html');
  const fileUrl = `file://${indexPath}`;
  
  console.log(`Loading generated website from: ${fileUrl}`);
  
  try {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Take desktop screenshots
    console.log('Taking desktop generated site screenshots...');
    await page.screenshot({ 
      path: `generated-desktop-full-${timestamp}.png`, 
      fullPage: true 
    });
    
    await page.screenshot({ 
      path: `generated-desktop-viewport-${timestamp}.png`
    });
    
    // Take mobile viewport screenshots
    console.log('Taking mobile generated site screenshots...');
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: `generated-mobile-full-${timestamp}.png`, 
      fullPage: true 
    });
    
    await page.screenshot({ 
      path: `generated-mobile-viewport-${timestamp}.png`
    });
    
    console.log('Generated site screenshots completed!');
    
  } catch (error) {
    console.error('Error taking generated site screenshots:', error);
    console.log('Make sure the index.html file exists and is properly formatted.');
  }
  
  await page.close();
}

function generateComparisonReport(timestamp) {
  console.log('\n=== GENERATING COMPARISON REPORT ===');
  
  const reportContent = `# Website Comparison Report
Generated on: ${new Date().toLocaleString()}
Timestamp: ${timestamp}

## Screenshots Taken

### Reference Website (Liverpool FC)
- reference-desktop-full-${timestamp}.png (Full page desktop view)
- reference-desktop-viewport-${timestamp}.png (Desktop viewport)
- reference-mobile-full-${timestamp}.png (Full page mobile view)
- reference-mobile-viewport-${timestamp}.png (Mobile viewport)

### Generated Website (Mobile Repair Site)
- generated-desktop-full-${timestamp}.png (Full page desktop view)
- generated-desktop-viewport-${timestamp}.png (Desktop viewport)
- generated-mobile-full-${timestamp}.png (Full page mobile view)
- generated-mobile-viewport-${timestamp}.png (Mobile viewport)

## Comparison Checklist

### Layout & Structure
- [ ] Overall page hierarchy matches reference
- [ ] Section spacing is proportional
- [ ] Grid alignment is consistent
- [ ] Navigation placement is similar

### Visual Design
- [ ] Color scheme follows Liverpool FC inspiration (#c8102e)
- [ ] Typography is professional and readable
- [ ] Button styles are consistent
- [ ] Visual hierarchy is clear

### Responsive Behavior
- [ ] Mobile navigation functions properly
- [ ] Content reflows correctly at breakpoints
- [ ] Touch targets are appropriately sized
- [ ] Text remains readable on small screens

### User Experience
- [ ] Loading performance is acceptable
- [ ] Animations are smooth
- [ ] Forms function correctly
- [ ] Cross-browser compatibility verified

## Next Steps

1. Open screenshots side-by-side for visual comparison
2. Identify specific design gaps
3. Update CSS/HTML to address inconsistencies
4. Re-run comparison script to verify improvements
5. Repeat until design alignment is achieved

## Files Generated
All screenshots saved to: ${process.cwd()}
`;

  const reportPath = `comparison-report-${timestamp}.md`;
  fs.writeFileSync(reportPath, reportContent);
  console.log(`Comparison report saved to: ${reportPath}`);
}

async function runComparison() {
  console.log('🔍 Starting Website Design Comparison Process');
  console.log('This will compare the Liverpool FC reference site with the generated mobile repair site');
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  try {
    // Take reference screenshots first
    const timestamp = await takeReferenceScreenshots(browser);
    
    // Take generated site screenshots
    await takeGeneratedSiteScreenshots(browser, timestamp);
    
    // Generate comparison report
    generateComparisonReport(timestamp);
    
    console.log('\n✅ Comparison process completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Review the screenshots side-by-side');
    console.log('2. Check the comparison report for detailed analysis');
    console.log('3. Make necessary design adjustments');
    console.log('4. Re-run this script to verify improvements');
    
  } catch (error) {
    console.error('Error during comparison process:', error);
  } finally {
    await browser.close();
  }
}

// Run the comparison if this script is executed directly
if (require.main === module) {
  runComparison().catch(console.error);
}

module.exports = { runComparison, takeReferenceScreenshots, takeGeneratedSiteScreenshots };