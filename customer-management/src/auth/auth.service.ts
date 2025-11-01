import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Customer } from '../customers/entities/customer.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone, address } = registerDto;

    // Check if customer already exists
    const existingCustomer = await this.customerRepository.findOne({
      where: { email },
    });

    if (existingCustomer) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const customer = this.customerRepository.create({
      email,
      passwordHash: hashedPassword,
      name,
      phone,
      address,
    });

    await this.customerRepository.save(customer);

    // Generate JWT token
    const token = this.generateToken(customer);

    // Remove password from response
    const { passwordHash, ...customerWithoutPassword } = customer;

    return {
      customer: customerWithoutPassword,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find customer
    const customer = await this.customerRepository.findOne({
      where: { email },
    });

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      customer.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(customer);

    // Remove password from response
    const { passwordHash, ...customerWithoutPassword } = customer;

    return {
      customer: customerWithoutPassword,
      token,
    };
  }

  async getMe(customerId: string) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new UnauthorizedException('Customer not found');
    }

    const { passwordHash, ...customerWithoutPassword } = customer;
    return customerWithoutPassword;
  }

  private generateToken(customer: Customer): string {
    const payload: JwtPayload = {
      sub: customer.id,
      email: customer.email,
      name: customer.name,
    };

    return this.jwtService.sign(payload);
  }
}
