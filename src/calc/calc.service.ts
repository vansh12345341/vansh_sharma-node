import { Injectable, BadRequestException } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const expression = calcBody.expression;
    try {
      // Tokenize the expression
      const tokens = this.tokenize(expression);
      //checking if token array is empty
      if (tokens.length === 0 || typeof tokens[tokens.length - 1] === 'string') {
        throw new Error('Invalid expression');
      }

      // calculate and return the result
      const result = this.calculate(tokens);

      return  result ;
    } catch (error) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid expression provided',
        error: 'Bad Request',
      });
    }
  }

  private tokenize(expression: string): (number | string)[] {
    const tokens: (number | string)[] = [];
    let num = '';

     // looping on the expression
    for (let char of expression) {
      // /\d/.test(char) used here to check if the character is number or not
      if (/\d/.test(char)) {
         // If the character is digit add to current number 
        num += char;
      } else if (['+', '-', '*', '/'].includes(char)) {
        if (num) {
          // If the character is operator push the current number and operator to tokens array
          tokens.push(parseFloat(num));
          num = '';
        }
        tokens.push(char);
      } else if (char !== ' ') {
        throw new Error('Invalid character in expression');
      }
    }

    if (num) {
      tokens.push(parseFloat(num));
    }

    return tokens;
  }

  private calculate(tokens: (number | string)[]): number {

    let result: (number | string)[] = [];
    let current = tokens[0] as number;

     // handle multiplication and division
    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i] as string;
      const nextNumber = tokens[i + 1] as number;

      if (operator === '*' || operator === '/') {
        current = operator === '*' ? current * nextNumber : current / nextNumber;
      } else {
        result.push(current);
        result.push(operator);
        current = nextNumber;
      }
    }
    result.push(current);

    let finalResult = result[0] as number;

    // handle addition and subtraction
    for (let i = 1; i < result.length; i += 2) {
      const operator = result[i] as string;
      const nextNumber = result[i + 1] as number;

      if (operator === '+') {
        finalResult += nextNumber;
      } else if (operator === '-') {
        finalResult -= nextNumber;
      }
    }

    return finalResult;
  }
}
