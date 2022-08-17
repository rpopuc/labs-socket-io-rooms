import { LoggerInterface } from "./LoggerInterface";

export class ConsoleLogger implements LoggerInterface
{
  private prefix: string

  constructor(prefix: string = '') {
    this.prefix = prefix
  }

  log(message: string, context: any): void {
    message = this.prefix + message
    console.log(JSON.stringify({
      message,
      context
    }))
  }
}