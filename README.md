# Okan Ergürbüz · Kişisel Site

Canlı adres: **https://okanergurbuz.github.io**

Türkçe / İngilizce, gece modlu, tek sayfalık kişisel site. Herhangi bir kurulum veya derleme gerektirmez: düz HTML, CSS ve JavaScript.

## Dosyalar

| Dosya | İçinde ne var | Ne zaman açarsın |
|---|---|---|
| `index.html` | Sayfadaki bütün yazılar, projeler, beceriler, iletişim bilgileri | Yazı eklemek, değiştirmek, yeni proje koymak |
| `css/style.css` | Renkler, yazı tipleri, boşluklar, animasyon hızları | Görünümü değiştirmek |
| `js/main.js` | TR/EN düğmesi, gece modu, e-posta kopyalama, animasyonlar | Genelde gerekmez |
| `images/` | (İstersen oluştur) Proje ekran görüntüleri | Görsel eklemek |

## Sık yapılan değişiklikler

### Bir yazıyı değiştirmek
`index.html` içinde yazıyı bul. Her yazının iki dili yan yana durur:

```html
<span lang="tr">Staja açık</span><span lang="en">Open to internships</span>
```

İkisini de güncelle. Sadece birini değiştirirsen diğer dilde eski hali görünür.

### Yeni proje eklemek
`index.html` içinde `PROJELER` yorumunu bul. Bir `<article class="proj"> ... </article>` bloğunu baştan sona kopyala, hemen altına yapıştır, sonra başlığı (`<h3>`), açıklamayı (`<p>`) ve etiketi (`<ul class="tags"><li>Python</li></ul>`) değiştir.

### Temsili görsel yerine gerçek ekran görüntüsü koymak
1. Depoda `images` adlı bir klasör oluştur ve görseli içine yükle (ör. `images/bot.png`).
2. İlgili projede `<div class="shot" aria-hidden="true"> ... </div>` bloğunun içini sil ve yerine şunu yaz:
   ```html
   <img src="images/bot.png" alt="Haber botunun ekran görüntüsü">
   ```

### Beceri eklemek
`BECERİLER` yorumunun altında ilgili sütuna bir satır ekle: `<li>Excel</li>`. Üstteki kayan şeritte de görünsün istersen `KAYAN ŞERİT` kısmındaki **iki** satıra da ekle (birebir aynı olmaları gerekiyor).

### Renkleri değiştirmek
`css/style.css` dosyasının en üstündeki `:root { ... }` bloğunda her rengin adı ve kodu var. Örneğin mavi yerine yeşil istersen `--blue: #2E4CFF;` satırını değiştir. Gece modu renkleri hemen altındaki iki blokta.

### İsmin altındaki yazılıp silinen kelimeler
`js/main.js` içinde `var words =` satırını bul, Türkçe (`tr`) ve İngilizce (`en`) listeleri düzenle.

## Değişikliği yayına almak

**GitHub sitesinden:** Dosyayı aç → sağ üstteki kalem simgesi (Edit) → değiştir → **Commit changes**. 1–2 dakika içinde canlı sitede görünür.

**Bilgisayardan (git ile):**
```bash
git clone https://github.com/okanergurbuz/okanergurbuz.github.io.git
cd okanergurbuz.github.io
# dosyaları düzenle, sonra:
git add .
git commit -m "Projeleri güncelledim"
git push
```

Değişiklikten önce siteyi bilgisayarında görmek için `index.html` dosyasına çift tıklaman yeterli.
