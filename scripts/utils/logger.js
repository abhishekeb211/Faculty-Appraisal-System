#!/usr/bin/env node
/**
 * Cross-platform logging utility for automation scripts
 * Provides consistent logging with colors, timestamps, and log levels
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

class Logger {
  constructor(level = 'INFO', enableColors = true) {
    this.level = logLevels[level] ?? logLevels.INFO;
    this.enableColors = enableColors && process.stdout.isTTY;
    this.logFile = null;
  }

  setLogFile(filePath) {
    this.logFile = filePath;
  }

  formatMessage(level, message, color) {
    const timestamp = new Date().toISOString();
    const prefix = this.enableColors ? `${color}[${level}]${colors.reset}` : `[${level}]`;
    return `${timestamp} ${prefix} ${message}`;
  }

  writeToFile(message) {
    if (this.logFile) {
      const fs = require('fs');
      const path = require('path');
      const logDir = path.dirname(this.logFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      fs.appendFileSync(this.logFile, message + '\n', 'utf8');
    }
  }

  log(level, message, color) {
    const levelNum = logLevels[level];
    if (levelNum <= this.level) {
      const formatted = this.formatMessage(level, message, color);
      console.log(formatted);
      this.writeToFile(formatted);
    }
  }

  error(message) {
    this.log('ERROR', message, colors.red);
  }

  warn(message) {
    this.log('WARN', message, colors.yellow);
  }

  info(message) {
    this.log('INFO', message, colors.cyan);
  }

  debug(message) {
    this.log('DEBUG', message, colors.blue);
  }

  success(message) {
    this.log('INFO', message, colors.green);
  }

  section(title) {
    const line = '='.repeat(60);
    const formatted = this.enableColors
      ? `${colors.bright}${colors.cyan}${line}\n${title}\n${line}${colors.reset}`
      : `${line}\n${title}\n${line}`;
    console.log(formatted);
    this.writeToFile(`${line}\n${title}\n${line}`);
  }
}

module.exports = Logger;