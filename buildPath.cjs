const fs = require('fs');
const path = require('path');

// Caminho para o arquivo index.html
const indexPath = path.join(__dirname, 'dist', 'index.html');

// Ler o arquivo index.html
fs.readFile(indexPath, 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }

    // Substituir /player/ por ./ apenas dentro das tags script e link
    const result = data.replace(/(<script[^>]*>[^<]*<\/script>|<link[^>]*>)/g, function(match) {
        // Substituir /player/ por ./
        return match.replace(/\/player\//g, './');
    });

    // Escrever as alterações de volta para index.html
    fs.writeFile(indexPath, result, 'utf8', function(err) {
        if (err) return console.log(err);
    });
});
