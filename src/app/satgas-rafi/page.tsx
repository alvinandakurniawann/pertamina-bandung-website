"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PertaminaSatgasRafi: React.FC = () => {
  const CONTACT = {
    phone: "135",
    email: "pcc135@pertamina.com",
    mailSubject: "Permintaan Informasi Satgas RAFI",
    mailBody:
      "Halo Tim PCC,\n\nPertanyaan/Keluhan Anda isi di sini.\n\nTerima kasih.",
  };

  return (
    <div className="bg-background-light m-0 p-0 dark:bg-background-dark font-display min-h-screen flex flex-col">
      <Header />

      {/* Content Wrapper */}
      <div className="flex-1 relative w-full overflow-x-hidden">
        {/* Hero Section */}
        <div className="p-0">
          <div
            className="relative flex min-h-[560px] flex-col items-center justify-center bg-cover bg-center md:bg-center p-6 text-center @[480px]:rounded-lg"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("/rafi.svg")',
                
            }}
          >
            {/*  Responsif background position */}
            <style jsx>{`
              @media (max-width: 768px) {
                div[style*="rafi.svg"] {
                  background-position: right center !important;
                }
              }
            `}</style>

            <div className="flex max-w-2xl flex-col items-center gap-4">
              <h1 className="text-3xl md:text-5xl font-black text-white text-shadow leading-tight">
                Pertamina Patra Niaga
                <br />
                Satgas RAFI 2025
              </h1>
              <p className="text-base md:text-lg font-normal text-white/90 text-shadow">
                Energi Siaga untuk Perjalanan Aman Ramadhan & Idul Fitri
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex flex-col">
          {/* About Section */}
          <section className="px-4 py-12 sm:py-16 bg-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-black">
                Tentang Satgas RAFI
              </h2>
              <p className="mt-4 text-base sm:text-xl text-black/90">
                <strong>Satgas RAFI (Satuan Tugas Ramadhan dan Idul Fitri)</strong>{" "}
                adalah tim operasional Pertamina dan sektor ESDM yang bertugas
                memastikan ketersediaan dan kelancaran pasokan energi selama
                periode Ramadhan dan Idul Fitri, termasuk BBM, LPG, Avtur, dan
                listrik.
              </p>
            </div>

            {/* 3 Cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-gray-100 p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                  <svg
                    fill="currentColor"
                    height="28"
                    width="28"
                    viewBox="0 0 256 256"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm-4.6,76.69c-3.11,73.61-64.44,98.2-75.4,102.55-10.84-4.33-72.29-28.84-75.4-102.55V56h150.8ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-black">
                  Ketersediaan Energi
                </h3>
                <p className="text-black/80 text-sm sm:text-base">
                  Menjamin pasokan BBM, LPG, dan energi lainnya tetap aman di
                  seluruh wilayah, terutama jalur mudik dan daerah rawan suplai.
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-gray-100 p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                  <svg
                    fill="currentColor"
                    height="28"
                    width="28"
                    viewBox="0 0 256 256"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M247.42,117l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,247.42,117ZM184,88h34.58l9.6,24H184ZM24,72H168v64H24ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208Zm81-24H103a32,32,0,0,0-62,0H24V152H168v12.31A32.11,32.11,0,0,0,153,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,184,208Zm48-24H215a32.06,32.06,0,0,0-31-24V128h48Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-black">
                  Distribusi & Logistik
                </h3>
                <p className="text-black/80 text-sm sm:text-base">
                  Mengoptimalkan jalur distribusi, memantau stok SPBU, dan
                  menyiagakan armada tangki di titik-titik penting jalur mudik
                  nasional.
                </p>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-gray-100 p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                  <svg
                    fill="currentColor"
                    height="28"
                    width="28"
                    viewBox="0 0 256 256"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-black">
                  Pelayanan & Pengawasan
                </h3>
                <p className="text-black/80 text-sm sm:text-base">
                  Menyediakan SPBU siaga 24 jam, memantau kualitas dan takaran
                  BBM, serta melayani masyarakat di titik-titik strategis.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-white px-4 pb-12 sm:pb-16 lg:pb-20">
            <div className="flex justify-center mb-8">
              <h1 className="text-black text-center text-[24px] sm:text-[32px] lg:text-[40px] font-bold">
                Tujuan Satgas RAFI
              </h1>
            </div>

            <div className="flex flex-col max-w-3xl sm:max-w-4xl mx-auto text-black">
              <ul className="list-disc list-outside mx-auto pl-[40px] space-y-4 text-[16px] leading-relaxed">
                <li className="text-justify">
                  Menjamin pasokan energi nasional: termasuk BBM, LPG, Avtur, dan listrik selama masa Ramadhan dan Idul Fitri.
                </li>
                <li className="text-justify">
                  Memastikan distribusi berjalan lancar di seluruh wilayah, terutama di jalur mudik dan daerah terpencil.
                </li>
                <li className="text-justify">
                  Memberikan pelayanan cepat melalui posko siaga, SPBU 24 jam, dan layanan darurat kontak 135.
                </li>
                <li className="text-justify">
                  Melakukan pengawasan kualitas dan takaran BBM agar masyarakat mendapatkan produk energi yang tepat dan aman.
                </li>
                <li className="text-justify">
                  Mengantisipasi lonjakan permintaan energi akibat meningkatnya mobilitas masyarakat saat mudik dan arus balik.
                </li>
              </ul>
            </div>
          </section>


          {/* Contact Section */}
          <section className="bg-white pt-0 pb-[60px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-black">
                Hubungi Kami
              </h2>
              <p className="mt-4 text-base sm:text-lg text-black/80">
                Untuk informasi lebih lanjut tentang Satgas RAFI, silakan
                hubungi tim kami.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT.email}&su=${encodeURIComponent(
                    CONTACT.mailSubject
                  )}&body=${encodeURIComponent(CONTACT.mailBody)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center rounded-full border border-black bg-white px-6 text-base font-bold text-black transition-transform hover:scale-105 hover:bg-gray-900 hover:text-white"
                >
                  Email: {CONTACT.email}
                </a>
              </div>

              <p className="mt-4 text-sm text-black/80">
                Atau gunakan nomor darurat 135 untuk layanan pelanggan.
              </p>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default PertaminaSatgasRafi;
