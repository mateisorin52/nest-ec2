import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.userService.getSingleUser(payload.sub);
    delete user.password_hash;
    console.log(user);
    return user;
  }
}
