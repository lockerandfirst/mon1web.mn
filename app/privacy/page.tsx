import { Footer } from "@/components/footer";

export const metadata = {
  title: "Нууцлалын Бодлого | Mon1.mn",
  description: "Mon1.mn платформын нууцлалын бодлого",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fff9fd]">
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#eeebff] bg-white p-6 shadow-[0_30px_70px_-30px_rgba(42, 0, 255,0.25)] md:p-10">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff3bad]">
            Privacy
          </p>
          <h1 className="mb-6 text-3xl font-black tracking-tight text-[#2a00ff] md:text-4xl">
            Нууцлалын бодлого
          </h1>
          <div className="space-y-5 text-sm font-medium leading-7 text-[#5b4a87]">
            <p>
              Mon1.mn нь хэрэглэгчийн хувийн мэдээллийг зөвхөн үйлчилгээ
              сайжруулах, аюулгүй байдлыг хангах зорилгоор ашиглана.
            </p>
            <p>
              Таны зөвшөөрөлгүйгээр хувийн мэдээллийг гуравдагч этгээдэд
              худалдахгүй, хуульд заасан үндэслэлгүйгээр дамжуулахгүй.
            </p>
            <p>
              Нууцлалтай холбоотой асуулт, хүсэлтийг бидэнтэй холбогдон хүссэн
              үедээ гаргах боломжтой.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
