const { PDFDocument } = require('pdf-lib');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { name, tc, address, phone, signature } = req.body;

        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([600, 400]);
            const { width, height } = page.getSize();

            page.drawText(`Adı Soyadı: ${name}`, { x: 50, y: height - 100 });
            page.drawText(`TC Kimlik No: ${tc}`, { x: 50, y: height - 120 });
            page.drawText(`Adres: ${address}`, { x: 50, y: height - 140 });
            page.drawText(`İletişim: ${phone}`, { x: 50, y: height - 160 });

            const signatureImage = await pdfDoc.embedPng(signature);
            page.drawImage(signatureImage, {
                x: 50,
                y: 50,
                width: 200,
                height: 100,
            });

            const pdfBytes = await pdfDoc.save();
            res.setHeader('Content-Disposition', 'attachment; filename="karavan_sozlesmesi.pdf"');
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfBytes);
        } catch (error) {
            console.error('PDF oluşturma hatası:', error);
            res.status(500).send('PDF oluşturulamadı.');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
