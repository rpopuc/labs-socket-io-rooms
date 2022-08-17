import { LoggerInterface } from "./LoggerInterface";

export class NullLogger implements LoggerInterface
{
  log(message: string, context: any): void {
    // nothing
  }
}