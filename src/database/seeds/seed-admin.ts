import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../app.module';
import { UsersService } from '../../api/v1/users/users.service';
import { Role } from '../../common/enums/role.enum';

async function bootstrap() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: npm run seed:admin -- <email> <password>');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const existing = await usersService.findByEmail(email);
  if (existing) {
    console.error(`Error: email "${email}" is already taken`);
    await app.close();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await usersService.createUser({
    email,
    passwordHash,
    name: 'Admin',
    role: Role.ADMIN,
  });

  console.log(
    `Admin created successfully — id: ${user.id}, email: ${user.email}`,
  );
  await app.close();
}

bootstrap();
