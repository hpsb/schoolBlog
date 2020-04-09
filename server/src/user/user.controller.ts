import {
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  UsePipes,
  ParseIntPipe,
  ValidationPipe,
  Body,
  Request,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from '../database/models/user.model';
import { LoginGuard } from '../common/guards/login.guard';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { FormatResponseInterceptor } from '../common/interceptors/formatResponse.interceptor';
import { LoginDto } from './dto/login.dto';

import { ApiTags, ApiOperation, ApiBasicAuth } from '@nestjs/swagger';
import { LevelGuard } from 'src/common/guards/level.guard';
import { Level } from 'src/common/decorators/level.decorator';
import { Levels } from 'src/common/util/level.enum';
import { GetOptionsDto } from 'src/common/dto/getOptions.dto';

@ApiTags('user')
@UseInterceptors(FormatResponseInterceptor)
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Log in with st number and password' })
  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Body(ValidationPipe) body: LoginDto, @Request() req): number {
    return req.user.id;
  }

  @ApiOperation({ summary: 'Get the current logged in user' })
  @ApiBasicAuth()
  @UseGuards(AuthenticatedGuard)
  @Get('/current')
  async getCurrent(@Request() req): Promise<UserModel> {
    return await this.userService.getById(req.user.id);
  }

  @ApiOperation({ summary: 'Get a user by portal id' })
  @ApiBasicAuth()
  @UseGuards(AuthenticatedGuard)
  @Get('portal/:id')
  async getByPortal(@Param('id', ParseIntPipe) id: string): Promise<UserModel> {
    return await this.userService.getByPortalId(id);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiBasicAuth()
  @UseGuards(AuthenticatedGuard, LevelGuard)
  @Level(Levels.Moderator)
  @Get('/all')
  async getAll(
    @Query(new ValidationPipe({ transform: true })) options: GetOptionsDto
  ): Promise<UserModel[]> {
    return await this.userService.getAll(options);
  }

  @ApiOperation({ summary: 'Log out' })
  @ApiBasicAuth()
  @UseGuards(AuthenticatedGuard)
  @Get('/logout')
  logout(@Request() req) {
    req.logout();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiBasicAuth()
  @UseGuards(AuthenticatedGuard)
  @UsePipes(ParseIntPipe)
  @Get(':id')
  getById(@Param('id') id: number): Promise<UserModel> {
    return this.userService.getById(id);
  }

  @ApiOperation({ summary: 'Set user level (for admins)' })
  @ApiBasicAuth()
  @UseGuards(AuthenticatedGuard, LevelGuard)
  @Level(Levels.Admin)
  @UsePipes(ParseIntPipe)
  @Post('/level/:id')
  setLevel(
    @Param('id') id: number,
    @Body('level') level: number,
  ): Promise<UserModel> {
    return this.userService.setLevel(id, level);
  }
}
