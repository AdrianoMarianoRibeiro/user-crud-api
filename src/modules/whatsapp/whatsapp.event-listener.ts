import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class WhatsAppEventListener {
  @OnEvent('whatsapp.qrcode')
  handleQRCodeEvent(qrCode: string) {
    console.log('Novo QR Code gerado:', qrCode);
  }

  @OnEvent('whatsapp.status')
  handleStatusEvent(status: string) {
    console.log('Status do WhatsApp alterado para:', status);
  }
}
