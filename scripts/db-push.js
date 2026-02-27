import { spawn } from 'child_process';

async function runPush() {
    const cp = spawn('npx', ['drizzle-kit', 'push'], {
        shell: true,
        stdio: ['pipe', 'pipe', 'inherit']
    });

    cp.stdout.on('data', (data) => {
        const output = data.toString();
        process.stdout.write(output);

        // Drizzle kit uses prompts. We try to select "Yes"
        if (output.includes('Yes,')) {
            // In some versions it's the second option. 
            // We send Arrow Down and Enter
            cp.stdin.write('\x1b[B\n');
        } else if (output.includes('statements?')) {
            cp.stdin.write('y\n');
        }
    });

    return new Promise((resolve) => {
        cp.on('close', resolve);
    });
}

runPush();
