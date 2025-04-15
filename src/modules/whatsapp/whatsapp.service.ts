import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { Buttons, Client, LocalAuth } from 'whatsapp-web.js';

@Injectable()
export class WhatsAppService implements OnModuleInit {
  private readonly logger = new Logger(WhatsAppService.name);
  private client: Client;
  private lastQr: string | null = null;

  async onModuleInit() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
      },
    });

    this.client.on('qr', async (qr) => {
      this.logger.log('QR Code gerado. Aguardando escaneamento...');
      this.lastQr = await QRCode.toDataURL(qr); // gera base64 para frontend
    });

    this.client.on('ready', () => {
      this.logger.log('WhatsApp pronto para uso!');
      this.lastQr = null;
    });

    this.client.on('authenticated', () => {
      this.logger.log('Autenticado com sucesso!');
      this.lastQr = null;
    });

    this.client.on('auth_failure', (msg) => {
      this.logger.error(`Falha de autenticação: ${msg}`);
    });

    this.client.on('disconnected', (reason) => {
      this.logger.warn(`Cliente desconectado: ${reason}`);
    });

    await this.client.initialize();
  }

  getQrCode(): string | null {
    return this.lastQr;
  }

  async sendMessage(phoneNumber: string, message: string): Promise<any> {
    const chatId = phoneNumber.includes('@c.us')
      ? phoneNumber
      : `${phoneNumber}@c.us`;

    try {
      return await this.client.sendMessage(chatId, message);
    } catch (err) {
      this.logger.error(`Erro ao enviar mensagem para ${phoneNumber}`, err);
      throw err;
    }
  }

  async sendMessageWithButtons(
    phoneNumber: string,
    body: string,
    buttons: string[],
    title?: string,
    footer?: string,
  ): Promise<any> {
    const chatId = phoneNumber.includes('@c.us')
      ? phoneNumber
      : `${phoneNumber}@c.us`;

    const buttonObjects = buttons.map((btnText, index) => ({
      body: btnText,
      id: `btn_${index}`, // opcional, ajuda no controle de eventos depois
    }));

    const buttonsObj = new Buttons(
      body,
      buttonObjects,
      title || '',
      footer || '',
    );

    return await this.client.sendMessage(chatId, buttonsObj);
  }
}
