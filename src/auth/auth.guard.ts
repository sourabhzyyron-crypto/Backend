// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';

// import { JwtService } from '@nestjs/jwt/dist/jwt.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private readonly jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();

//     const authHeader = request.headers.authorization;
//     console.log('Auth Header:', authHeader);

//     if (!authHeader) {
//       throw new UnauthorizedException('Authorization header missing');
//     }

//     const [type, token] = authHeader.split(' ');
//     console.log('Auth Type:', type);
//     console.log('Auth Token:', token);

//     return true;
//   }
// }

// //   if (type !== 'Bearer' || !token) {
// //     throw new UnauthorizedException('Invalid authorization format');
// //   }

// //   try {
// //     const payload = await this.jwtService.verifyAsync(token, {
// //       secret: process.env.JWT_SECRET,
// //     });

// //     request.user = payload;

// //     return true;
// //   } catch {
// //     throw new UnauthorizedException('Invalid or expired token');
// //   }
// // }
