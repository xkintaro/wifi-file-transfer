<a href="README.md">
  <img src="https://img.shields.io/badge/Language-English-blue?style=flat-square&logo=google-translate&logoColor=white" alt="English">
</a>
<a href="README-TR.md">
  <img src="https://img.shields.io/badge/Language-Türkçe-red?style=flat-square&logo=google-translate&logoColor=white" alt="Türkçe">
</a>

  <br />
  <br />

<div align="center">
  <img src="mascot.png" width="120" height="120" />
  <br />
  <br />

  <p>
     Cihazlar arasında Wi-Fi üzerinden dosya aktaran web tabanlı bir araç.
  </p>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

  <p>
    <a href="#about">Hakkında</a> •
    <a href="#features">Özellikler</a> •
    <a href="#tech">Teknolojiler</a> •
    <a href="#setup">Kurulum</a> •
    <a href="#gallery">Galeri</a> •
    <a href="#license">Lisans</a>
  </p>

  <br />
  <br />
</div>

## <a id="about"></a> 📋 Hakkında

**WiFi File Transfer**, aynı ağdaki cihazlar arasında dosya paylaşmak için hazırlanmış bir web uygulamasıdır. Uygulamayı bilgisayarınızda çalıştırıp telefonunuz gibi başka bir cihazın tarayıcısından açarsınız, böylece kablo ya da bulut hizmeti olmadan dosyaları iki yönde de aktarabilirsiniz.

Backend Express ile yazılmıştır ve dosyaları bilgisayarınızdaki `uploads` klasöründe tutar. Arayüz ise React ve kendi [Kintaro UI](https://github.com/xkintaro/kintaro-ui) kütüphanemle hazırlanmıştır.

## <a id="features"></a> ✨ Özellikler

- **Çoklu yükleme**: Birçok dosyayı tek seferde seçip yükleyin ve ilerlemesini takip edin.
- **Temiz dosya adları**: Dosya adlarındaki Türkçe karakterler ve geçersiz semboller temizlenir, adlara yükleme zamanı eklenir.
- **Tarayıcıda önizleme**: Görselleri, videoları, ses dosyalarını, PDF'leri ve metin dosyalarını doğrudan tarayıcıda açın. Görseller listede küçük önizlemeler olarak da gösterilir.
- **Toplu işlemler**: Birden fazla dosya seçip tarihli bir ZIP arşivi olarak indirin ya da silin.
- **Tekli dosya işlemleri**: Herhangi bir dosyayı tek tıkla indirin ya da silin.

## <a id="tech"></a> 🛠️ Teknolojiler

`React` · `Vite` · `Kintaro UI` · `React Icons` · `CSS` · `Node.js` · `Express` · `Multer` · `Archiver`

## <a id="setup"></a> 🚀 Kurulum

### Gereksinimler

- **Node.js 18 veya üzeri**

### Adım Adım Kurulum

1. **Depoyu klonlayın**

   ```bash
   git clone https://github.com/xkintaro/wifi-file-transfer.git
   cd wifi-file-transfer
   ```

2. **Bağımlılıkları yükleyin**

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

   Windows'ta bunun yerine `install-dependencies.bat` dosyasını çalıştırabilirsiniz.

3. **Ortam ayarlarını kontrol edin**

   Portlar ve API adresi `.env` dosyalarında ayarlanır.

   **backend/.env**

   ```
   VITE_BACKEND_PORT=5077
   ```

   **frontend/.env**

   ```
   VITE_FRONTEND_API_URL=http://localhost:5077
   VITE_FRONTEND_PORT=5076
   ```

   Uygulamayı başka bir cihazdan kullanmak için `VITE_FRONTEND_API_URL` içindeki `localhost` yerine bilgisayarınızın yerel IP adresini yazın, örneğin `http://192.168.1.10:5077`.

4. **Backend'i ve frontend'i başlatın**

   Her birini ayrı bir terminalde başlatın.

   ```bash
   cd backend
   node index.js
   ```

   ```bash
   cd frontend
   npm run dev
   ```

   Windows'ta bunun yerine `run.bat` dosyasını çalıştırabilirsiniz. İkisini arka planda başlatmak için `run-wifi-file-transfer.vbs` dosyasını çalıştırın. Bu dosya uygulamayı `C:\wifi-file-transfer` klasöründen başlatır, bu yüzden kullanmak için projeyi bu klasöre klonlayın. Uygulamanın Windows açılırken otomatik başlaması için `Win+R` tuşlarına basın, `shell:startup` yazın ve açılan klasöre `run-wifi-file-transfer.vbs` dosyasının kısayolunu koyun.

Uygulamayı şu adreste açın: [http://localhost:5076](http://localhost:5076). Başka bir cihazda aynı portu bilgisayarınızın IP adresiyle açın.

## <a id="gallery"></a> 🖼️ Galeri

<img src="md/20260311100927157.jpg" width="100%" />

<img src="md/20260311100927226.jpg" />

## <a id="license"></a> 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakabilirsiniz.

#

<p align="center">
  <sub>❤️ Developed by "Mustafa TAŞAL" (kintaro)</sub>
</p>
