const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

const API_URL = "https://api.beanstreet.me";

async function main() {
    const rl = readline.createInterface({ input, output });

    while (true) {
        // Clear terminal (equivalent to os.system("cls"))
        console.clear();

        try {
            // GET items (equivalent to requests.get().content)
            const response = await fetch(API_URL);
            const items = await response.text();
            console.log(`Current items: ${items}`);

            // Get user input
            const action = await rl.question("Would you like to add an item, or take an item? (add, take): ");

            if (action === "add") {
                const selection = await rl.question("What is the name of the item you would like to add? ");
                const seller = await rl.question("What is your name? ");
                const cost = await rl.question("What is item cost? ");

                console.log(1);
                await fetch(API_URL, {
                    method: 'POST',
                    body: `${action}: ${selection}:${seller}:${cost}`
                });
                console.log(2);
            } 
            
            else if (action === "take") {
                const selection = await rl.question("What is the name of the item you would like to take? ");

                console.log(1);
                await fetch(API_URL, {
                    method: 'POST',
                    body: `${action}: ${selection}`
                });
                console.log(2);
            }

        } catch (error) {
            console.error("Connection Error:", error.message);
            // Brief pause so the user can see the error before loop resets
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

main();
