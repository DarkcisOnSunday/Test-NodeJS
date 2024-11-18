import { Controller, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('fix-problems')
  async fixProblems(): Promise<{ fixedCount: number }> {
    const fixedCount = await this.userService.fixUserProblems();
    return { fixedCount };
  }
}