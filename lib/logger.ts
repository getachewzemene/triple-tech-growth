/**
 * Production-ready logger
 * Supports different log levels and formats
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    name?: string;
  };
}

class Logger {
  private level: LogLevel;
  private format: "json" | "text";

  constructor() {
    this.level = this.parseLogLevel(process.env.LOG_LEVEL || "info");
    this.format = (process.env.LOG_FORMAT as "json" | "text") || "json";
  }

  private parseLogLevel(level: string): LogLevel {
    const levelMap: Record<string, LogLevel> = {
      error: LogLevel.ERROR,
      warn: LogLevel.WARN,
      info: LogLevel.INFO,
      debug: LogLevel.DEBUG,
    };
    return levelMap[level.toLowerCase()] ?? LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private formatLog(entry: LogEntry): string {
    if (this.format === "json") {
      return JSON.stringify(entry);
    }

    const parts = [
      entry.timestamp,
      `[${entry.level}]`,
      entry.message,
    ];

    if (entry.context) {
      parts.push(JSON.stringify(entry.context));
    }

    if (entry.error) {
      parts.push(`Error: ${entry.error.message}`);
      if (entry.error.stack) {
        parts.push(`\n${entry.error.stack}`);
      }
    }

    return parts.join(" ");
  }

  private log(
    level: LogLevel,
    levelName: string,
    message: string,
    context?: Record<string, unknown>
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level: levelName,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    const output = this.formatLog(entry);

    if (level === LogLevel.ERROR) {
      console.error(output);
    } else if (level === LogLevel.WARN) {
      console.warn(output);
    } else {
      console.log(output);
    }
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: "ERROR",
      message,
      timestamp: new Date().toISOString(),
      context,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : undefined,
    };

    console.error(this.formatLog(entry));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, "WARN", message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, "INFO", message, context);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, "DEBUG", message, context);
  }

  // Helper method for API requests
  logRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: Record<string, unknown>
  ): void {
    this.info(`${method} ${path} ${statusCode}`, {
      ...context,
      duration,
      statusCode,
    });
  }
}

// Export singleton instance
export const logger = new Logger();
