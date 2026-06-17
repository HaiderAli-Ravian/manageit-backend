import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { setAuthCookies, clearAuthCookies } from './helpers/cookies.helper';
import { User } from '../users/entities/user.entity';
import {
  ApiSuccessResponse,
  ApiErrorResponse,
} from '../../../common/decorators/swagger';
import { UserResponseDto } from '../users/dto/user-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create a new user account',
    description: 'Hashes password, creates user, sets access and refresh cookies',
  })
  @ApiSuccessResponse(UserResponseDto, { status: 201, description: 'Account created' })
  @ApiErrorResponse(400, 'VALIDATION_ERROR', 'Invalid input')
  @ApiErrorResponse(409, 'EMAIL_TAKEN', 'Email already in use')
  @Public()
  @Post('signup')
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.signup(dto);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    const { passwordHash: _, ...safeUser } = user as any;
    return safeUser;
  }

  @ApiOperation({ summary: 'Sign in', description: 'Verifies credentials and sets auth cookies' })
  @ApiSuccessResponse(UserResponseDto, { description: 'Logged in' })
  @ApiErrorResponse(400, 'VALIDATION_ERROR', 'Invalid input')
  @ApiErrorResponse(401, 'UNAUTHORIZED', 'Invalid credentials')
  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(dto);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    const { passwordHash: _, ...safeUser } = user as any;
    return safeUser;
  }

  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Reads refresh_token cookie and issues a new access_token cookie',
  })
  @ApiCookieAuth('access_token')
  @ApiSuccessResponse(undefined, { description: 'Access token refreshed' })
  @ApiErrorResponse(401, 'UNAUTHORIZED', 'Refresh token invalid or expired')
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.refresh(user);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
    return { message: 'Token refreshed' };
  }

  @ApiOperation({ summary: 'Sign out', description: 'Clears auth cookies' })
  @ApiSuccessResponse(undefined, { description: 'Signed out' })
  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    clearAuthCookies(res);
  }

  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiCookieAuth('access_token')
  @ApiSuccessResponse(UserResponseDto, { description: 'Current user' })
  @ApiErrorResponse(401, 'UNAUTHORIZED', 'Not authenticated')
  @Get('me')
  me(@CurrentUser() user: User) {
    const { passwordHash: _, ...safeUser } = user as any;
    return safeUser;
  }
}
