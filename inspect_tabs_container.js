import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

const tabTitle = $('.e-n-tab-title-text').first();
const nestedTabsContainer = tabTitle.closest('.elementor-widget-nested-tabs, .e-n-tabs');
console.log("=== NESTED TABS CONTAINER HTML ===");
console.log("CLASS:", nestedTabsContainer.attr('class'), "DATA-ID:", nestedTabsContainer.attr('data-id'));
console.log("HTML:", nestedTabsContainer.html().substring(0, 1500));
