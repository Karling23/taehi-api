import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('home', () => {
    it('should return API home payload', () => {
      const result = appController.getHome();
      expect(result.message).toBe('API TAEHI backend activa');
    });
  });

  describe('health', () => {
    it('should return backend health payload', () => {
      const result = appController.getHealth();
      expect(result.status).toBe('ok');
      expect(result.service).toBe('taehi-backend');
    });
  });
});
