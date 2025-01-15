export class TicketGenerator {
    private static generateRandomLetters(length: number): string {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return Array(length)
        .fill(null)
        .map(() => letters.charAt(Math.floor(Math.random() * letters.length)))
        .join('');
    }
  
    private static generateRandomNumbers(length: number): string {
      return Array(length)
        .fill(null)
        .map(() => Math.floor(Math.random() * 10))
        .join('');
    }
  
    static generateTicketId(): string {
      const letters = this.generateRandomLetters(2);
      const numbers = this.generateRandomNumbers(6);
      return `${letters}-${numbers}`;
    }
  }