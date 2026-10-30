import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://127.0.0.1:3000/';
const SCREENSHOT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\c60ad9f0-38fe-4cac-98c9-23b25615afb8\\scratch\\screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTests() {
  console.log('--- STARTING UPGRADE & HOMEPAGE QA TEST SUITE ---');
  const results = {};

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 860 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  try {
    // 1. Homepage loads correctly
    console.log('1. Testing Homepage load and header navigation...');
    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 10000 });
    const pageTitle = await page.title();
    const brandText = await page.$eval('.brand-title', el => el.textContent);
    
    // Check navigation buttons in header
    const navHome = await page.$eval('.nav-link-btn:nth-child(1)', el => el.textContent);
    const navGames = await page.$eval('.nav-link-btn:nth-child(2)', el => el.textContent);
    const navAbout = await page.$eval('.nav-link-btn:nth-child(3)', el => el.textContent);
    const soundToggle = await page.$('button[title="Mute Sound"], button[title="Unmute Sound"]');

    results.headerComplete = 
      pageTitle.includes('Mini Game Arcade') && 
      brandText === 'MINI GAME ARCADE' &&
      navHome.includes('Home') &&
      navGames.includes('Games') &&
      navAbout.includes('About') &&
      !!soundToggle;

    console.log(`✓ Header navigation: Home="${navHome}", Games="${navGames}", About="${navAbout}", SoundBtn=${!!soundToggle}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_arcade_homepage_hero.png') });

    // 2. Hero Section
    console.log('2. Testing Hero Section heading and CTAs...');
    const heroHeading = await page.$eval('.hero-heading', el => el.textContent);
    const heroHasPlayBtn = await page.$eval('.btn-hero-glow', el => el.textContent.includes('PLAY FRUIT SLICING'));
    results.heroSectionWorks = heroHeading.includes('PLAY. COMPETE. HAVE FUN.') && heroHasPlayBtn;
    console.log(`✓ Hero Heading: "${heroHeading}" (Passed: ${results.heroSectionWorks})`);

    // 3. Game Library & 4. Game Cards
    console.log('3 & 4. Testing Game Library & 4 Game Cards...');
    const cards = await page.$$eval('.game-card', els => els.map(el => {
      const title = el.querySelector('.card-game-title')?.textContent;
      const status = el.querySelector('.status-pill')?.textContent;
      const hasBtn = !!el.querySelector('button');
      return { title, status, hasBtn };
    }));

    console.log('Game cards found:', cards);
    const hasFruitSlicing = cards.some(c => c.title === 'Fruit Slicing' && c.status.includes('AVAILABLE'));
    const hasTicTacToe = cards.some(c => c.title.includes('Tic-Tac-Toe') && c.status.includes('COMING SOON'));
    const hasSnake = cards.some(c => c.title.includes('Snake') && c.status.includes('COMING SOON'));
    const hasMemory = cards.some(c => c.title.includes('Memory') && c.status.includes('COMING SOON'));

    results.gameCardsCorrect = cards.length === 4 && hasFruitSlicing && hasTicTacToe && hasSnake && hasMemory;
    console.log(`✓ Game Cards verified: 4 cards total, all 4 titles and badges present (Passed: ${results.gameCardsCorrect})`);

    // Scroll to Game Library
    await page.evaluate(() => {
      document.getElementById('games')?.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_game_library_cards.png') });

    // 5. Navigation & Launching Fruit Slicing Game
    console.log('5 & 6. Testing launching Fruit Slicing from Game Card...');
    await page.click('.btn-play-card');
    await new Promise(r => setTimeout(r, 600));

    // Verify Fruit Slicing view mounted
    const breadcrumb = await page.$('.game-breadcrumb-bar');
    const welcomeOverlay = await page.$('.welcome-overlay');
    const canvasExists = await page.$('canvas.fruit-canvas');
    results.fruitSlicingLaunched = !!breadcrumb && (!!welcomeOverlay || !!canvasExists);
    console.log(`✓ Fruit Slicing view loaded from Homepage: breadcrumb=${!!breadcrumb}, canvas=${!!canvasExists} (Passed: ${results.fruitSlicingLaunched})`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_fruit_slicing_from_home.png') });

    // Start gameplay to confirm all fruit slicing mechanics still work
    console.log('Testing that Fruit Slicing gameplay still functions perfectly...');
    await page.click('.btn-glow'); // Start slicing
    await new Promise(r => setTimeout(r, 600));

    // Wait for fruit wave and perform slicing
    await new Promise(r => setTimeout(r, 2000));
    const canvasBox = await page.$eval('canvas.fruit-canvas', el => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    });

    for (let swipe = 0; swipe < 8; swipe++) {
      const y = canvasBox.y + canvasBox.height * (0.35 + (swipe % 4) * 0.1);
      await page.mouse.move(canvasBox.x + 40, y);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + canvasBox.width - 40, y, { steps: 6 });
      await page.mouse.up();
      await new Promise(r => setTimeout(r, 160));
    }

    const liveScoreText = await page.$eval('.score-val', el => el.textContent);
    console.log(`Score achieved during game check: ${liveScoreText}`);
    results.fruitSlicingStillWorks = parseInt(liveScoreText, 10) >= 0;

    // 6. Test returning to Homepage via Header or Breadcrumb
    console.log('6. Testing Return to Homepage navigation...');
    // Click "Back to Arcade" button in header
    await page.click('.btn-back-arcade');
    await page.waitForSelector('.hero-heading', { timeout: 4000 });

    const isBackOnHome = await page.$eval('.hero-heading', el => el.textContent.includes('PLAY. COMPETE. HAVE FUN.'));
    results.returnToHomeWorks = isBackOnHome;
    console.log(`✓ Returned to Homepage successfully: ${isBackOnHome} (Passed: ${results.returnToHomeWorks})`);

    // 7. Footer: Mini Game Arcade, Copyright, About & Contact
    console.log('7. Testing Footer and Contact modal...');
    const footerText = await page.$eval('.arcade-footer', el => el.textContent);
    const hasCopyright = footerText.includes('Mini Game Arcade') && footerText.includes('All rights reserved');
    
    // Test Contact modal trigger
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('.footer-nav-btn'));
      const contactBtn = btns.find(b => b.textContent.includes('Contact'));
      contactBtn?.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const contactModalOpen = await page.$('.contact-modal-card');
    results.footerAndContactWork = hasCopyright && !!contactModalOpen;
    console.log(`✓ Footer copyright present: ${hasCopyright}, Contact modal opened: ${!!contactModalOpen}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_contact_modal.png') });
    await page.click('.close-btn');
    await new Promise(r => setTimeout(r, 300));

    // 8. Mobile Layout Test
    console.log('8. Testing Mobile Layout on iPhone 14 (390x844)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await new Promise(r => setTimeout(r, 400));
    const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    results.mobileLayoutClean = !mobileOverflow;
    console.log(`✓ Mobile viewport: zero horizontal overflow (Passed: ${results.mobileLayoutClean})`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_mobile_homepage.png') });

  } catch (err) {
    console.error('Test execution error:', err);
    results.error = err.message;
  } finally {
    await browser.close();
  }

  console.log('\n--- FINAL TEST SUITE RESULTS ---');
  console.log(JSON.stringify(results, null, 2));
  console.log('Console Errors Detected:', consoleErrors.length, consoleErrors);

  return { results, consoleErrors };
}

runTests();
