const puppet    = require('puppeteer')

const SELECTORS = require('./selectors.json');

async function run(name) {
    const browser = await puppet.launch({
        headless: true
    });

    const page = await browser.newPage();

    await page.goto('https://kahoot.it');

    await page.click(SELECTORS.pin);
    await page.keyboard.type(process.argv[2]);
    
    await page.click(SELECTORS.pinBtn);

    try {
        await page.waitForSelector(SELECTORS.name, { visible: true, timeout: 5*1000 });
    }
    catch {
        console.log("Error: Game Pin is not valid :/");
        process.exit(0);
    }

    await page.click(SELECTORS.name);
    await page.keyboard.type(name);

    await page.click(SELECTORS.nameBtn);

    var reachedEnd = false;

    console.log(name + " says: Im ready!");

    while (!reachedEnd) {
        await page.waitForSelector(SELECTORS.quizBoard, { visible: true, timeout: 0 });

        var rand = Math.floor(Math.random() * SELECTORS.quizBtns.length);

        console.log(name + " says: Imma go with answer #" + rand + "!");

        await page.click(SELECTORS.quizBtns[rand]);
        
        try {
            await page.waitForSelector(SELECTORS.podium, { visible: true, timeout: 5*1000 });

            reachedEnd = true;

            console.log(name + "says: GG");
        }
        catch {
            console.log(name + " says: Anotha one!");
        }
    }

    browser.close();
}

if (process.argv.length < 4) {
    console.log("Error: No Game Pin was passed as parameter!");
    process.exit(-1);
}

var bots = [];

for (var i = 0; i < process.argv[4]; i++) {
    bots.push(run(process.argv[3] + "_" + i));
}

Promise.all(bots)
    .then(_ => console.log("Aight we done, goodnight loser."));
