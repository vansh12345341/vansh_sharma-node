import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CalcModule } from './calc/calc.module';
import { LoggerMiddleware } from './logger.middleware'; 

@Module({
  imports: [CalcModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); 
  }
}
