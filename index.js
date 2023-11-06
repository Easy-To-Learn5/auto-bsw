const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')


const chromePaths = require('chrome-paths');
const fs = require('fs');
const delay = require('delay');
const cron = require('node-cron');

const getNewPageWhenLoaded =  async (browser) => {
    return new Promise(x =>
        browser.on('targetcreated', async target => {
            if (target.type() === 'page') {
                const newPage = await target.page();
                const newPagePromise = new Promise(y =>
                    newPage.once('domcontentloaded', () => y(newPage))
                );
                const isPageLoaded = await newPage.evaluate(
                    () => document.readyState
                );
                return isPageLoaded.match('complete|interactive')
                    ? x(newPage)
                    : x(newPagePromise);
            }
        })
    );
};


(async () => {

    puppeteer.use(
        RecaptchaPlugin({
          provider: {
            id: '2captcha',
            token: '' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
          },
          visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
        })
      )
      

    const metamaskExtension = '/Users/aminudin/Library/Application Support/Google/Chrome/Default/Extensions/nkbihfbeogaeaoehlefnkodbefgpgknn/10.11.3_0';

    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--disable-accelerated-2d-canvas',
        '--no-zygote',
        '--no-first-run',
        '--disable-dev-shm-usage',
        '--window-size=1920x1080',
        `--disable-extensions-except=${metamaskExtension}`, 
        `--load-extension=${metamaskExtension}`,
        '--enable-automation',
        '--disable-gpu'
    ];


    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        executablePath: chromePaths.chrome,
        slowMo: 0,
        devtools: false,
        args
    });


    const pages = await browser.pages();
    const page = pages[0];
    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://beastfi.org/r/23239', {
        waitUntil: 'networkidle0',
        timeout: 120000,
    });

    
    await delay(10000);
    const pagesNew = await browser.pages();
    const page2 = pagesNew[1];
    await page2.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div > button');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div > div > button").click());

    await page2.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div.select-action__wrapper > div > div.select-action__select-buttons > div:nth-child(2) > button');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div > div.select-action__wrapper > div > div.select-action__select-buttons > div:nth-child(2) > button").click());

    await page2.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div > div.metametrics-opt-in__footer > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div > div > div.metametrics-opt-in__footer > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button").click());

    await page2.waitForSelector("#create-password");
    await page2.type("#create-password", 'passwordku', { delay: 30 });

    await page2.waitForSelector("#confirm-password");
    await page2.type("#confirm-password", 'passwordku', { delay: 30 });

    await page2.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div:nth-child(2) > form > div.first-time-flow__checkbox-container > div');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div > div:nth-child(2) > form > div.first-time-flow__checkbox-container > div").click());

    await page2.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div:nth-child(2) > form > button');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div > div:nth-child(2) > form > button").click());

    // await page2.waitForSelector('//*[@id="app-content"]/div/div[2]/div/div/div[2]/div/div[1]/div[2]/button');
    // await page2.evaluate(() => document.querySelector('//*[@id="app-content"]/div/div[2]/div/div/div[2]/div/div[1]/div[2]/button').click());
    await delay(7000)
    const elements = await page2.$x('//*[@id="app-content"]/div/div[2]/div/div/div[2]/div/div[1]/div[2]')
    await elements[0].click() 

    await page2.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div.reveal-seed-phrase > div.reveal-seed-phrase__buttons > button.button.btn--rounded.btn-secondary.first-time-flow__button');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div > div.reveal-seed-phrase > div.reveal-seed-phrase__buttons > button.button.btn--rounded.btn-secondary.first-time-flow__button").click());

    await page2.waitForSelector('#popover-content > div > div > section > header > div > button');
    await page2.evaluate(() => document.querySelector("#popover-content > div > div > section > header > div > button").click());

    await page2.waitForSelector('#app-content > div > div.app-header.app-header--back-drop > div > div.app-header__account-menu-container > div.app-header__network-component-wrapper > div > div.chip__right-icon > i');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.app-header.app-header--back-drop > div > div.app-header__account-menu-container > div.app-header__network-component-wrapper > div > div.chip__right-icon > i").click());

    await page2.waitForSelector('#app-content > div > div.menu-droppo-container.network-droppo > div > button');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.menu-droppo-container.network-droppo > div > button").click());

    // network name
    await page2.waitForSelector("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(1) > label > input");
    await page2.type("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(1) > label > input", 'Smart Chain', { delay: 30 });

    // new rpc url
    await page2.waitForSelector("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(2) > label > input");
    await page2.type("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(2) > label > input", 'https://bsc-dataseed.binance.org/', { delay: 30 });

    // chain id
    await page2.waitForSelector("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(3) > label > input");
    await page2.type("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(3) > label > input", '56', { delay: 30 });

    // currency symbol
    await page2.waitForSelector("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(4) > label > input");
    await page2.type("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(4) > label > input", 'BNB', { delay: 30 });

    // Block explorer url
    await page2.waitForSelector("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(5) > label > input");
    await page2.type("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(5) > label > input", 'https://bscscan.com', { delay: 30 });

    await delay(5000);

    await page2.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-footer > button.button.btn--rounded.btn-primary');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-footer > button.button.btn--rounded.btn-primary").click());


    await page2.waitForSelector('#app-content > div > div.app-header.app-header--back-drop > div > div.app-header__account-menu-container > div.account-menu__icon > div > div > div');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.app-header.app-header--back-drop > div > div.app-header__account-menu-container > div.account-menu__icon > div > div > div").click());

    await page2.waitForSelector('#app-content > div > div.account-menu > div:nth-child(11)');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.account-menu > div:nth-child(11)").click());

    await page2.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__tabs > div > button:nth-child(4) > div.tab-bar__tab__content');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__tabs > div > button:nth-child(4) > div.tab-bar__tab__content").click());

    // reveal
    await page2.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div.settings-page__body > div:nth-child(1) > div:nth-child(2) > div > button');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div.settings-page__body > div:nth-child(1) > div:nth-child(2) > div > button").click());

    await page2.waitForSelector("#password-box");
    await page2.type("#password-box", 'coegsekali1', { delay: 30 });

    await page2.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.btn--large.page-container__footer-button');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.btn--large.page-container__footer-button").click());

    await page2.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.btn--large.page-container__footer-button');
    await page2.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.btn--large.page-container__footer-button").click());

    await page2.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.page-container__content > div.reveal-seed__content > div > div > div.export-text-container__text-container > div');
    let elementTextPharse = await page2.$('#app-content > div > div.main-container-wrapper > div > div.page-container__content > div.reveal-seed__content > div > div > div.export-text-container__text-container > div');
    let valueTextPharse = await page2.evaluate(el => el.textContent, elementTextPharse);
    fs.appendFileSync('wallet.txt', `${valueTextPharse}|passwordku\n`, 'utf-8');
    

    await page.bringToFront();

    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

    await page.waitForSelector('#svelte > div.page-container > main > header > div > div > div.btns-wrap > button');
    await page.evaluate(() => document.querySelector("#svelte > div.page-container > main > header > div > div > div.btns-wrap > button").click());
    
    await page.waitForSelector('#svelte > div.mfp-wrap.mfp-close-btn-in.mfp-auto-cursor.mfp-ready > div > div > div > div > div.items > button:nth-child(1)');
    await page.evaluate(() => document.querySelector("#svelte > div.mfp-wrap.mfp-close-btn-in.mfp-auto-cursor.mfp-ready > div > div > div > div > div.items > button:nth-child(1)").click());
    
    // metamask popup
    try{
        const newPagePromise = await getNewPageWhenLoaded(browser);
        const newPage = await newPagePromise;

        await newPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.permissions-connect-choose-account > div.permissions-connect-choose-account__footer-container > div.permissions-connect-choose-account__bottom-buttons > button.button.btn--rounded.btn-primary');
        await newPage.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div.permissions-connect-choose-account > div.permissions-connect-choose-account__footer-container > div.permissions-connect-choose-account__bottom-buttons > button.button.btn--rounded.btn-primary").click());
        
        await newPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.page-container.permission-approval-container > div.permission-approval-container__footers > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button');
        await newPage.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div.page-container.permission-approval-container > div.permission-approval-container__footers > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button").click());
        
        await newPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.request-signature__footer > button.button.btn--rounded.btn-primary.btn--large.request-signature__footer__sign-button');
        await newPage.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div.request-signature__footer > button.button.btn--rounded.btn-primary.btn--large.request-signature__footer__sign-button").click());
        
        await newPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.request-signature__footer > button.button.btn--rounded.btn-primary.btn--large.request-signature__footer__sign-button');
        await newPage.evaluate(() => document.querySelector("#app-content > div > div.main-container-wrapper > div > div.request-signature__footer > button.button.btn--rounded.btn-primary.btn--large.request-signature__footer__sign-button").click());
    
    }catch(err){
        console.log('')
    }

    await page.waitForSelector('#svelte > div.page-container > main > section.home-1 > div > div > div > div > div:nth-child(4) > div > div > div > div.btns-wrap > a.btn.btn--blue');
    await page.evaluate(() => document.querySelector("#svelte > div.page-container > main > section.home-1 > div > div > div > div > div:nth-child(4) > div > div > div > div.btns-wrap > a.btn.btn--blue").click());
    

    cron.schedule('*/5 * * * *', async () => {
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

        await page.waitForSelector('#svelte > div.page-container > main > section.deposits-rewards-1 > div > div.items > div > div.right > div.header-wrap > div.btn-wrap > button');
        await page.evaluate(() => document.querySelector("#svelte > div.page-container > main > section.deposits-rewards-1 > div > div.items > div > div.right > div.header-wrap > div.btn-wrap > button").click());
        
        await page.solveRecaptchas()
    });

    
})();
