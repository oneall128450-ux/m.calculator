const MiniExcel = {
    export(headers, rows, options = {}) {
        // 1. تحديد وضع الصفحة (داكن أو فاتح) بناءً على الاختيار
        const isDark = options.theme === 'dark';
        
        // 2. مصفوفة الألوان الخمسة المطلوبة (خلفية ونص متناسق)
        const colors = {
            green:  { bg: '#22c55e', text: '#ffffff' },
            red:    { bg: '#ef4444', text: '#ffffff' },
            yellow: { bg: '#eab308', text: '#000000' },
            black:  { bg: '#000000', text: '#ffffff' },
            white:  { bg: '#ffffff', text: '#000000' }
        };

        // 3. بناء الأنماط (CSS) الخاصة بالجدول والألوان والثيم
        let styles = `
            body { background: ${isDark ? '#0f172a' : '#ffffff'}; color: ${isDark ? '#f8fafc' : '#000000'}; font-family: Arial, sans-serif; direction: rtl; }
            table { border-collapse: collapse; margin: 20px auto; }
            th, td { border: 1px solid ${isDark ? '#334155' : '#cbd5e1'}; padding: 8px 12px; text-align: center; }
            th { background: ${isDark ? '#1e293b' : '#f1f5f9'}; font-weight: bold; }
        `;
        
        // دمج الألوان الخمسة في الأنماط
        Object.keys(colors).forEach(c => {
            styles += `.${c} { background-color: ${colors[c].bg} !important; color: ${colors[c].text} !important; }`;
        });

        // 4. بناء هيكل الجدول (HTML) من البيانات والمرشحات
        let tableHtml = `<table><thead><tr>`;
        headers.forEach(h => tableHtml += `<th>${h}</th>`);
        tableHtml += `</tr></thead><tbody>`;

        rows.forEach(row => {
            tableHtml += `<tr>`;
            row.forEach(cell => {
                const isObj = typeof cell === 'object' && cell !== null;
                const val = isObj ? (cell.value ?? '') : cell;
                const cls = (isObj && cell.color) ? cell.color : '';
                tableHtml += `<td class="${cls}">${val}</td>`;
            });
            tableHtml += `</tr>`;
        });
        tableHtml += `</tbody></table>`;

        // 5. تجميع الملف النهائي بصيغة متوافقة مع Excel مع ترميز UTF-8
        const template = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head><meta charset="utf-8"><style>${styles}</style></head>
            <body>${tableHtml}</body>
            </html>
        `;

        // 6. إنشاء رابط التحميل وتنزيل الملف مباشرة فورياً دون روابط خارجية
        const blob = new Blob(['\ufeff' + template], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${options.filename || 'trading-report'}.xls`;
        a.click();
        URL.revokeObjectURL(url);
    }
};
