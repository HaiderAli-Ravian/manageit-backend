import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './api/v1/users/users.module';
import { AuthModule } from './api/v1/auth/auth.module';
import { TasksModule } from './api/v1/tasks/tasks.module';
import { TaskActivitiesModule } from './api/v1/task-activities/task-activities.module';
import { TaskAttachmentsModule } from './api/v1/task-attachments/task-attachments.module';
import { AdminModule } from './api/v1/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    TasksModule,
    TaskActivitiesModule,
    TaskAttachmentsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
