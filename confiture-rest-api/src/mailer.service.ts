import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Audit } from '@prisma/client';
import { createTransport, getTestMessageUrl, Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = createTransport({
      host: config.get('MAILER_SMTP_HOST'),
      port: config.get('MAILER_SMTP_PORT'),
      secure: config.get<boolean>('MAILER_SMTP_SECURE'),
      auth: {
        user: config.get('MAILER_USER'),
        pass: config.get('MAILER_PASSWORD'),
      },
    });
  }

  private sendMail(to: string, subject: string, text: string) {
    return this.transporter
      .sendMail({
        from: this.config.get('MAILER_USER'),
        to,
        subject,
        text,
      })
      .then((info) => {
        // TODO: check if the test url thing works with "real" email addresses
        console.log('Preview URL: ' + getTestMessageUrl(info));
      });
  }

  sendAuditCreatedMail(audit: Audit) {
    const auditUrl = `${this.config.get('FRONT_BASE_URL')}/audits/${
      audit.editUniqueId
    }`;
    return this.sendMail(
      audit.auditorEmail,
      'Nouvel audit créé',
      // `Votre audit pour "${audit.procedureName}" a été créé sur Confiture et est éditable à l'addresse: ${auditUrl}`,
      `Bonjour,

vous venez de créer l'audit ${audit.procedureName}.
Vous trouverez ci-dessous le lien administrateur. Ce lien vous permet de modifier ou de supprimer l’audit, ne le partagez pas. Pensez-bien à le conserver, c’est le seul moyen de reprendre l’édition de votre audit.

Lien administrateur : ${auditUrl}

Merci de votre confiance et à bientôt,
L’équipe Confiture`,
    );
  }
}
