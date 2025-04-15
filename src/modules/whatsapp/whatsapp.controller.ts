import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SendWhatsappButtonsDto, SendWhatsappMessageDto } from './whatsapp.dto';
import { WhatsAppService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Get('qrcode')
  getQr(@Res() res: Response) {
    const qr = this.whatsappService.getQrCode();

    if (!qr) {
      throw new HttpException(
        'QR Code não disponível (já autenticado ou não gerado ainda)',
        HttpStatus.NOT_FOUND,
      );
    }

    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <html>
        <body style="display:flex; justify-content:center; align-items:center; height:100vh; flex-direction:column;">
          <h2>Escaneie o QR Code com seu WhatsApp</h2>
          <img src="${qr}" />
        </body>
      </html>
    `);
  }

  @Post('send')
  async sendMessage(@Body() body: SendWhatsappMessageDto): Promise<any> {
    const { phoneNumber, message } = body;
    return await this.whatsappService.sendMessage(phoneNumber, message);
  }

  @Post('send-buttons')
  async sendButtons(@Body() body: SendWhatsappButtonsDto): Promise<any> {
    const { phoneNumber, message, buttons, title, footer } = body;
    return await this.whatsappService.sendMessageWithButtons(
      phoneNumber,
      message,
      buttons,
      title,
      footer,
    );
  }
}
