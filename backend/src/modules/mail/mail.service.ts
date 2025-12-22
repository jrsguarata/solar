import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendContactNotification(contactData: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    message: string;
  }): Promise<void> {
    const { name, email, phone, company, message } = contactData;

    await this.mailerService.sendMail({
      to: 'solar.guarata@gmail.com',
      subject: `[Solar] Novo Contato: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Novo Contato Recebido</h2>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Telefone:</strong> ${phone}</p>
            ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ''}
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Mensagem:</h3>
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px;">
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="color: #6b7280; font-size: 12px;">
            Esta mensagem foi enviada através do formulário de contato do site Solar.
            <br>
            Data: ${new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      `,
    });
  }

  async sendContactConfirmation(email: string, name: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Recebemos seu contato - Solar',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Olá ${name}!</h2>

          <p>Recebemos sua mensagem e agradecemos pelo interesse em nossos serviços de Geração Distribuída.</p>

          <p>Nossa equipe analisará sua solicitação e entrará em contato em breve.</p>

          <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>💡 Dica:</strong> Enquanto aguarda nosso retorno, você pode conhecer mais sobre Geração Distribuída em nosso site.
            </p>
          </div>

          <p>Atenciosamente,<br><strong>Equipe Solar</strong></p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="color: #6b7280; font-size: 12px;">
            Este é um e-mail automático, por favor não responda.
          </p>
        </div>
      `,
    });
  }
}
