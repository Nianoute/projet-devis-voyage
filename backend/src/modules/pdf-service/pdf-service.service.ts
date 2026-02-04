import { Injectable } from '@nestjs/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

interface QuoteOptions {
  vehicleLabel: string;
  vehiclePrice: number;
  accommodationLabel: string;
  accommodationPrice: number;
  tripLabel: string;
  tripPrice: number;
}

@Injectable()
export class PdfServiceService {
  generatePdfWithTitle(title: string, subtitle: string, filename: string = 'document.pdf'): Buffer {
    const doc = new jsPDF();
    
    // Couleur et police pour le titre
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(title, 105, 30, { align: 'center' });
    
    // Couleur et police pour le sous-titre
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, 105, 50, { align: 'center' });
    
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 60, 190, 60);
    
    // Retourner le PDF en tant que Buffer
    return Buffer.from(doc.output('arraybuffer'));
  }

  generatePdfWithContent(title: string, subtitle: string, content: string): Buffer {
    const doc = new jsPDF();
    
    // Titre
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(title, 105, 30, { align: 'center' });
    
    // Sous-titre
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, 105, 50, { align: 'center' });
    
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 60, 190, 60);
    
    // Contenu
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const splitText = doc.splitTextToSize(content, pageWidth - 40);
    doc.text(splitText, 20, 75);
    
    return Buffer.from(doc.output('arraybuffer'));
  }

  generateQuotePdf(
    userName: string,
    siteName: string,
    options: QuoteOptions
  ): Buffer {
    const doc = new jsPDF();
    
    // En-tête avec nom du site
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(siteName, 20, 20);
    
    // Nom de l'utilisateur et "DEVIS"
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Client: ${userName}`, 20, 30);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('DEVIS', 190, 30, { align: 'right' });
    
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);
    
      // Calcul du total
      const total =
        options.vehiclePrice +
        options.accommodationPrice +
        options.tripPrice;
    
    // Tableau des options avec autoTable
    autoTable(doc, {
      startY: 50,
      head: [['Service', 'Prix (€)']],
      body: [
        [options.vehicleLabel, `${options.vehiclePrice.toFixed(2)}`],
        [options.accommodationLabel, `${options.accommodationPrice.toFixed(2)}`],
        [options.tripLabel, `${options.tripPrice.toFixed(2)}`],
      ],
      headStyles: {
        fillColor: [40, 40, 40],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 12,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 11,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        1: { halign: 'right' },
      },
      margin: { left: 20, right: 20 },
    });
    
    // Total en bas
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setDrawColor(40, 40, 40);
    doc.line(20, finalY - 5, 190, finalY - 5);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('Montant total:', 120, finalY, { align: 'left' });
    doc.text(`${total.toFixed(2)} €`, 190, finalY, { align: 'right' });
    
    // Date du devis
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    const today = new Date().toLocaleDateString('fr-FR');
    doc.text(`Généré le ${today}`, 20, 280);
    
    return Buffer.from(doc.output('arraybuffer'));
  }

  async sendQuotePdfByEmail(
    userName: string,
    siteName: string,
    options: QuoteOptions,
    recipientEmail: string = 'test@test.com'
  ): Promise<any> {
    try {
      const pdfBuffer = this.generateQuotePdf(userName, siteName, options);
      
      const apiKey = process.env.BREVO_API_KEY;
      if (!apiKey) {
        throw new Error('BREVO_API_KEY is not defined in environment variables');
      }

      const pdfBase64 = pdfBuffer.toString('base64');

      const emailData = {
        sender: {
          name: siteName,
          email: process.env.BREVO_SENDER_EMAIL || 'noreply@example.com'
        },
        to: [
          {
            email: recipientEmail,
            name: userName
          }
        ],
        subject: `Devis ${siteName} - ${userName}`,
        htmlContent: `
          <html>
            <body>
              <h2>Votre Devis</h2>
              <p>Bonjour ${userName},</p>
              <p>Veuillez trouver ci-joint votre devis pour ${siteName}.</p>
              <br/>
              <p>Cordialement,</p>
              <p>L'équipe ${siteName}</p>
            </body>
          </html>
        `,
        attachment: [
          {
            name: 'devis.pdf',
            content: pdfBase64
          }
        ]
      };

      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        emailData,
        {
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending email:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

}
