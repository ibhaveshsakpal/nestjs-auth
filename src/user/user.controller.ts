import { Body, Controller, Get, HttpStatus, Post, Response, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGuard } from './user.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async sigUp(@Body() body: any, @Response() res) {
    try {
      const newUser = await this.userService.signUp(body);
      return res.status(HttpStatus.CREATED).json({
        message: 'Signed Up Successfully!',
        user: newUser,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error?.message,
      });
    }
  }

  @Post('login')
  async signIn(@Body() body: any, @Response() res) {
    try {
      const loggedIn = await this.userService.signIn(body);
      if (loggedIn) {
        return res.status(HttpStatus.OK).json({
          message: 'Logged In Successfully!',
          login_details: loggedIn,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: error?.message,
      });
    }
  }

  @UseGuards(UserGuard)
  @Get("profile")
  getProfile(){
    return this.userService.getProfile();
  }
}
