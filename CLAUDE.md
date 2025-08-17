# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Playwright-based web scraping project that automates browser interactions to capture screenshots of web pages. The main focus is on scraping the Liverpool FC website, with plans for a mobile repair site in the `mobile-repair-site` subdirectory.

## Project Structure

```
├── liverpool-scraper.js          # Main Playwright script for Liverpool FC website scraping
├── package.json                   # Project dependencies (only @playwright/test)
├── package-lock.json             # Lock file for dependencies
├── mobile-repair-site/            # Subdirectory for future mobile repair site
│   ├── css/                       # CSS files (currently empty)
│   ├── js/                        # JavaScript files (currently empty)
│   └── images/                    # Image assets (currently empty)
├── liverpool-homepage-full.png    # Generated full page screenshot
└── liverpool-homepage-viewport.png # Generated viewport screenshot
```

## Development Commands

### Installation
```bash
npm install
```

### Running the Scraper
```bash
node liverpool-scraper.js
```

## Code Architecture

### Main Components

1. **liverpool-scraper.js** - The primary script containing:
   - `closePopups(page)` function: Handles various types of pop-ups, cookie banners, and modals using a comprehensive list of selectors
   - `scrapeLiverpoolFC()` function: Main orchestration function that launches browser, navigates to the site, handles pop-ups, and captures screenshots

### Key Features

- **Browser Configuration**: Uses Chromium in non-headless mode with slow motion for visibility
- **Popup Handling**: Comprehensive popup detection and closing mechanism covering:
  - Cookie banners and consent forms
  - Newsletter and promotional pop-ups  
  - Generic modal dialogs
  - Font Awesome close icons
- **Screenshot Capture**: Takes both full-page and viewport screenshots
- **Error Handling**: Graceful handling of missing selectors and timeouts

### Technical Details

- **Browser**: Chromium via Playwright
- **Viewport**: Set to 1920x1080 for consistent screenshots
- **Timeout Strategy**: Uses various timeout configurations (2s for popup detection, 30s for page load, 30s browser display)
- **Wait Strategies**: Employs `networkidle` and `waitForLoadState` for reliable page loading

## Mobile Repair Site

The `mobile-repair-site` directory contains a static website designed based on scraped reference websites. 

### Design Approach
- **Reference-Based Design**: Mobile website should be designed based on scraped websites (like Liverpool FC) that serve as visual references
- **Screenshot-First Strategy**: Always ensure pop-ups are completely disabled before taking screenshots to capture the true website appearance
- **Simple Implementation**: Keep the mobile repair site design simple while maintaining the professional aesthetic of the reference website
- **Mobile-First**: Responsive design optimized for mobile devices

### Directory Structure
- `css/` - Responsive CSS styling based on reference website design patterns
- `js/` - Basic JavaScript functionality for interactions
- `images/` - Image assets and screenshots used for design reference

### Critical Requirements
When taking screenshots of any reference website:
1. All pop-ups, modals, and overlays must be closed before capturing screenshots
2. Cookie banners, newsletter sign-ups, and promotional overlays should be dismissed
3. Screenshots should represent the clean, unobstructed view of the original content
4. Use both full-page and viewport screenshots for comprehensive design reference

## Design Comparison Workflow

This project follows an iterative design approach that compares the generated website against the original reference website to ensure design fidelity.

### Step-by-Step Process

1. **Take Fresh Reference Screenshot**
   - Run the scraper to capture current state of reference website (Liverpool FC)
   - Ensure all pop-ups are closed before screenshot
   - Save with timestamp for version tracking

2. **Generate Initial Website Draft**
   - Create HTML/CSS based on reference design analysis
   - Implement mobile-first responsive design
   - Focus on layout structure, color scheme, and typography

3. **Screenshot Generated Website**
   - Launch local development server
   - Capture screenshots at multiple viewport sizes
   - Document both desktop and mobile views

4. **Side-by-Side Comparison**
   - Compare reference vs generated screenshots
   - Identify design gaps and inconsistencies
   - Document specific areas needing improvement

5. **Iterative Refinement**
   - Make targeted CSS/HTML adjustments
   - Re-test and re-screenshot
   - Repeat until design alignment is achieved

### Comparison Criteria

When comparing reference vs generated websites, evaluate:

**Layout & Structure**
- Overall page hierarchy and flow
- Section spacing and proportions
- Grid alignment and consistency
- Navigation placement and behavior

**Visual Design**
- Color scheme accuracy (#c8102e primary for Liverpool FC inspiration)
- Typography choices and sizing
- Button styles and interactions
- Image placement and sizing

**Responsive Behavior**
- Mobile navigation functionality
- Content reflow at different breakpoints
- Touch target sizing
- Readability at small screen sizes

**User Experience**
- Loading performance
- Smooth scrolling and animations
- Form functionality and validation
- Cross-browser compatibility

### Quality Assurance Checklist

Before considering the website complete:
- [ ] Visual consistency with reference website achieved
- [ ] Mobile responsiveness verified across devices
- [ ] All interactive elements function properly
- [ ] Form submissions work as expected
- [ ] Performance is acceptable (< 3s load time)
- [ ] Cross-browser testing completed
- [ ] Accessibility standards met

### Tools and Commands

**Take Reference Screenshot:**
```bash
node ../liverpool-scraper.js
```

**Launch Local Development:**
```bash
# Simple HTTP server for testing
python -m http.server 8000
# or
npx serve .
```

**Screenshot Comparison Script:**
```bash
node comparison-scraper.js
```

This script will:
- Take fresh screenshots of Liverpool FC website (desktop & mobile)
- Screenshot the generated mobile repair site (desktop & mobile)
- Generate a comparison report with checklist
- Save all files with timestamps for tracking

**Files Generated:**
- `reference-desktop-full-[timestamp].png`
- `reference-mobile-viewport-[timestamp].png`
- `generated-desktop-full-[timestamp].png`
- `generated-mobile-viewport-[timestamp].png`
- `comparison-report-[timestamp].md`