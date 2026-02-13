import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/sign-up.dto';
import { SigninDto } from './dto/sign-in.dto';
import { DocumentValidator } from 'src/shared/validators/document.validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    const user = await this.usersRepo.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const accessToken = await this.generateAccessToken(user.id);

    return { accessToken };
  }

  async signup(signupDto: SignupDto) {
    const { name, email, password, document, nationality } = signupDto;

    // valida documento
    if (nationality === 'BR') {
      const valid = DocumentValidator.isValidCPF(document);

      if (!valid) {
        throw new BadRequestException('Invalid CPF. Please type in this format: 111.222.333-44');
      }
    } else {
      const valid = DocumentValidator.isValidForeignDoc(document);

      if (!valid) {
        throw new BadRequestException(
          'Invalid foreign document (6-20, A-Z, 0-9 or "-")',
        );
      }
    }

    // verifica email duplicado
    const emailTaken = await this.usersRepo.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailTaken) {
      throw new ConflictException('This email is already in use.');
    }

    const hashedPassword = await hash(password, 12);

    const normalizedDocument =
      nationality === 'BR'
        ? DocumentValidator.onlyDigits(document)
        : DocumentValidator.normalizeForeignDoc(document);

    const user = await this.usersRepo.create({
      data: {
        name,
        email,
        password: hashedPassword,
        document: normalizedDocument,
        nationality,
      },
    });

    const accessToken = await this.generateAccessToken(user.id);

    return { accessToken };
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.signAsync({ sub: userId });
  }
}
