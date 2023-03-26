import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey123',
    })
  }

  // validateという名前にしなければならない
  async validate(payload: { id: string; username: string }): Promise<User> {
    const { id, username } = payload;
    const user = await this.userRepository.findOne({ id, username });

    if (user) {
      return user;
    }
    throw new UnauthorizedException();
  }
}