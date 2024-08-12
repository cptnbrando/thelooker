import { getPrompt } from "./prompt-engineering.js";
import { execSync, spawn } from 'child_process';

main();

async function main() {
    console.log("Yeehaw");

    // console.log(getPrompt());

    const prompt = getPrompt() + " /home/bdcruz/Pictures/driveway1.jpg";

    askRobot(prompt).then(() => {
        console.log('Prompt sent successfully.');
    }).catch(err => {
        console.error('Error sending prompt:', err);
    });
}

async function startOllama() {
    await execSync("ollama serve --model llava");
}

// async function askRobot(prompt) {
//     await execSync(`ollama run llava`, { encoding: 'utf8' });
//     await execSync(`${prompt}`, { encoding: 'utf8' });
// }

async function askRobot(prompt) {
    return new Promise((resolve, reject) => {
        // Start the `ollama` command
        const ollamaProcess = spawn('ollama', ['run', 'llava'], {
            stdio: ['pipe', 'pipe', 'pipe'] // Use pipes for stdin, stdout, stderr
        });

        let loadingInterval;
        let outputBuffer = '';

        // Function to clear the loading symbols and print "Loading..."
        const showLoadingMessage = () => {
            process.stdout.write('\rLoading...');
        };

        // Function to clear the loading message
        const clearLoadingMessage = () => {
            process.stdout.write('\r                    \r'); // Clear the loading message by overwriting it with spaces
        };

        // Function to filter out unwanted symbols
        const filterSymbols = (data) => {
            // Regex to remove specific Unicode symbols (adjust based on your needs)
            return data.replace(/[\u2500-\u257F\u2800-\u28FF-⠹]/g, ''); // Example: filtering box-drawing and Braille patterns
        };

        // Handle the input and output streams
        ollamaProcess.stdout.on('data', (data) => {
            // Filter and append data to the buffer
            outputBuffer += filterSymbols(data.toString());
        });

        ollamaProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ollamaProcess.on('close', (code) => {
            clearLoadingMessage();
            console.log('Output received:');
            console.log(outputBuffer.trim()); // Print the buffered output once the process is complete
            console.log(`ollama process exited with code ${code}`);
            resolve();
        });

        // Show the "Loading..." message
        loadingInterval = setInterval(showLoadingMessage, 100);

        // Send the prompt to the `ollama` process
        ollamaProcess.stdin.write(prompt + '\n');

        // Close stdin after sending the prompt
        ollamaProcess.stdin.end();

        // Clear the loading message and interval once processing is complete
        ollamaProcess.on('close', () => {
            clearInterval(loadingInterval);
        });
    });
}

