export interface ButtonOption {
  id: string;
  body: string;
}

export interface ButtonMessage {
  title?: string;
  body: string;
  footer?: string;
  buttons: ButtonOption[];
}

export interface WhatsappStatus {
  status:
    | 'CONNECTED'
    | 'DISCONNECTED'
    | 'CONNECTING'
    | 'AUTHENTICATING'
    | 'AUTHENTICATED';
  qrCode?: string;
}

export interface WhatsappMessage {
  to: string;
  content: string;
}
