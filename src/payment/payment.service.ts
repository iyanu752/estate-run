import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    log: any;
    fees: number;
    fees_split: any;
    authorization: any;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: any;
      risk_action: string;
    };
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  };
}

@Injectable()
export class PaymentService {
  private readonly baseUrl = 'https://api.paystack.co';
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    const key = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    if (!key) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured');
    }
    this.secretKey = key;
  }
  async verifyTransaction(
    reference: string,
  ): Promise<PaystackVerificationResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data as PaystackVerificationResponse;
    } catch (error) {
      console.error('Paystack verification error:', error);
      throw new HttpException(
        'Payment verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async initializeTransaction(data: {
    email: string;
    amount: number;
    reference: string;
    metadata?: Record<string, unknown>;
  }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email: data.email,
          amount: data.amount * 100,
          reference: data.reference,
          metadata: data.metadata,
          currency: 'NGN',
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response;
    } catch (error) {
      console.error('Paystack initialization error:', error);
      throw new HttpException(
        'Payment initialization failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
