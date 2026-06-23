const CMD_LANGUAGES = [
  'Python', 'R', 'SQL', 'Power BI', 'Tableau', 'Azure ML', 'AWS',
  'Pandas', 'Scikit-learn', 'TensorFlow', 'Apache Spark', 'Git', 'Docker',
  'HTML', 'CSS', 'JavaScript'
];

const CMD_PROMPT = 'C:\\Users\\Zé dos Dados>';
const CMD_COMMAND = 'type skills.txt';

let cmdTimer = null;
let cmdRunning = false;
let cmdGeneration = 0;

function initCmdTerminal() {
  const promptLabel = document.getElementById('xp-cmd-prompt-label');
  if (promptLabel) promptLabel.textContent = `${CMD_PROMPT} `;
  stopCmdTerminal();
}

function startCmdTerminal() {
  const output = document.getElementById('xp-cmd-output');
  const typed = document.getElementById('xp-cmd-typed');
  if (!output || !typed) return;

  stopCmdTerminal();
  cmdRunning = true;
  const generation = ++cmdGeneration;

  output.textContent = '';
  typed.textContent = '';

  runCmdSequence(output, typed, generation);
}

function stopCmdTerminal() {
  cmdRunning = false;
  cmdGeneration += 1;
  if (cmdTimer) {
    clearTimeout(cmdTimer);
    cmdTimer = null;
  }
}

function cmdWait(ms, generation) {
  return new Promise(resolve => {
    cmdTimer = setTimeout(() => {
      cmdTimer = null;
      resolve(cmdRunning && generation === cmdGeneration);
    }, ms);
  });
}

function cmdTypeText(el, text, speed, generation) {
  return new Promise(async resolve => {
    for (let i = 0; i < text.length; i++) {
      if (!cmdRunning || generation !== cmdGeneration) {
        resolve(false);
        return;
      }
      el.textContent += text[i];
      const ok = await cmdWait(speed, generation);
      if (!ok) {
        resolve(false);
        return;
      }
    }
    resolve(true);
  });
}

async function runCmdSequence(output, typed, generation) {
  const header = [
    'Microsoft Windows XP [Version 5.1.2600]',
    '(C) Copyright 1985-2001 Microsoft Corp.',
    ''
  ];

  for (const line of header) {
    if (!cmdRunning || generation !== cmdGeneration) return;
    if (line) {
      const ok = await cmdTypeText(output, line + '\n', 12, generation);
      if (!ok) return;
    } else {
      output.textContent += '\n';
    }
  }

  const okCmd = await cmdTypeText(typed, CMD_COMMAND, 55, generation);
  if (!okCmd) return;

  const okPause = await cmdWait(450, generation);
  if (!okPause) return;

  output.textContent += `${CMD_PROMPT} ${CMD_COMMAND}\n`;
  typed.textContent = '';

  for (const lang of CMD_LANGUAGES) {
    if (!cmdRunning || generation !== cmdGeneration) return;
    const ok = await cmdTypeText(output, lang + '\n', 28, generation);
    if (!ok) return;
    await cmdWait(120, generation);
  }

  cmdRunning = false;
}
