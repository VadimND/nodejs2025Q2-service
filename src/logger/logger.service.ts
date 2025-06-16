import { ConsoleLogger, Injectable } from '@nestjs/common';
import { appendFile, mkdir, readdir, stat } from 'fs/promises';
import { Request, Response } from 'express';
import { addErrorListeners } from './exceptions/process.exception.listener';

const LOG_LEVELS = ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'];
const LOG_LEVEL = parseInt(process.env.LOG_LEVEL || '3');
const LOG_FOLDER = process.env.LOG_FOLDER || 'logs';
const LOG_EXTENSION_LOG = process.env.LOG_EXTENSION_LOG || 'err';
const LOG_EXTENSION_ERR = process.env.LOG_EXTENSION_ERR || 'log';
const LOG_MAX_FILE_SIZE = parseInt(process.env.LOG_MAX_FILE_SIZE || '512') * 1024;

@Injectable()
export class LoggerService extends ConsoleLogger {
  private logFolder = LOG_FOLDER;
  private logLevel = LOG_LEVEL;
  private logFileExtension = LOG_EXTENSION_LOG;
  private errFileExtension = LOG_EXTENSION_ERR;
  private logMaxFileSize = LOG_MAX_FILE_SIZE;

  private logFileName = `${Math.round(Date.now() / 1000)}.${this.logFileExtension}`;

  private errFileName = `${Math.round(Date.now() / 1000)}.${this.errFileExtension}`;

  constructor() {
    super();
    addErrorListeners(this);
    this.checkLogFolder();
  }

  private async checkLogFolder() {
    try {
      await readdir(this.logFolder);
    } catch (err) {
      try {
        await mkdir(this.logFolder, { recursive: true });
      } catch (err) {
        console.error('Error creating logs directory:', err.message);
      }
    }
  }

  private async checkSizeLog() {
    const target = `${this.logFolder}/${this.logFileName}`;

    try {
      if (await this.fileExists(target)) {
        const { size } = await stat(target);
        if (size > this.logMaxFileSize) {
          this.logFileName = `${Math.round(Date.now() / 1000)}.${this.logFileExtension}`;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  private async checkSizeErr() {
    const target = `${this.logFolder}/${this.errFileName}`;

    try {
      if (await this.fileExists(target)) {
        const { size } = await stat(target);
        if (size > this.logMaxFileSize) {
          this.errFileName = `${Math.round(Date.now() / 1000)}.${this.errFileExtension}`;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  private async writeLog(level: number, message: string) {
    // await this.checkLogFolder();
    await this.checkSizeLog();

    const target = `${this.logFolder}/${this.logFileName}`;
    const timestamp = new Date().toISOString();
    const toWrite = `[${timestamp}] ${LOG_LEVELS[level]}: ${message}\n`;
    try {
      await appendFile(target, toWrite);
    } catch (err) {
      console.error('Error writing to log file:', err.message);
    }
  }

  private async writeErr(level: number, message: string) {
    // await this.checkLogFolder();
    await this.checkSizeErr();

    const target = `${this.logFolder}/${this.errFileName}`;
    const timestamp = new Date().toISOString();
    const toWrite = `[${timestamp}] ${LOG_LEVELS[level]}: ${message}\n`;
    try {
      await appendFile(target, toWrite);
    } catch (err) {
      console.error('Error writing to error log file:', err.message);
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await stat(filePath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      }
      throw new Error(error);
    }
  }

  async fatal(message: any) {
    super.error(message);
    await this.writeErr(0, message);
    await this.writeLog(0, message);
  }

  async error(message: any) {
    if (this.logLevel > 0) {
      super.error(message);
      await this.writeErr(1, message);
      await this.writeLog(1, message);
    }
  }

  async warn(message: any) {
    if (this.logLevel > 1) {
      super.warn(message);
      await this.writeLog(2, message);
    }
  }

  async log(message: any) {
    if (this.logLevel > 2) {
      super.log(message);
      await this.writeLog(3, message);
    }
  }

  async debug(message: any) {
    if (this.logLevel > 3) {
      super.debug(message);
      await this.writeLog(4, message);
    }
  }

  async verbose(message: any) {
    if (this.logLevel > 4) {
      super.verbose(message);
      await this.writeLog(5, message);
    }
  }

  async logRequest(req: Request, id?: string): Promise<void> {
    const { method, url, body, query } = req;
    await this.log(
      `Request-${id || req['id']}: ${method} ${url}, Query: ${JSON.stringify(
        query,
      )}, Body: ${JSON.stringify(body)}`,
    );
  }

  async logResponse(res: Response, id?: string, duration?: number): Promise<void> {
    const formatDuration = duration ? ` [${duration}ms]` : '';
    await this.log(`Response-${id || res['id']}: statusCode: ${res.statusCode}${formatDuration}`);
  }
}
