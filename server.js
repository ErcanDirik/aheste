const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Sözleşme şablonunu alıp yer tutucularını değiştirme
app.post('/generate-pdf', (req, res) => {
    const { name, tc, address, phone, signature } = req.body;
    
    fs.readFile(path.join(__dirname, 'public', 'contract_template.html'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Şablon okunamadı');
        }

        // Yer tutucuları müşteri bilgileriyle değiştirme
        let contractHtml = data
            .replace('{NAME}', name)
            .replace('{TC}', tc)
            .replace('{ADDRESS}', address)
            .replace('{PHONE}', phone)
            .replace('{SIGNATURE}', signature);

        // PDF oluşturma
        pdf.create(contractHtml).toFile('./karavan_sozlesmesi.pdf', (err, result) => {
            if (err) return res.status(500).send('PDF oluşturulamadı');
            res.sendFile(path.resolve(__dirname, 'karavan_sozlesmesi.pdf'));
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
