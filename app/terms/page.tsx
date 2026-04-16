import { Footer } from "@/components/footer";

export const metadata = {
  title: "Үйлчилгээний Нөхцөл | Mon1.mn",
  description: "Mon1.mn платформын үйлчилгээний нөхцөл",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fff9fd]">
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#eeebff] bg-white p-6 shadow-[0_30px_70px_-30px_rgba(42,0,255,0.25)] md:p-10">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff3bad]">
            Terms
          </p>
          <h1 className="mb-6 text-3xl font-black tracking-tight text-[#2a00ff] md:text-4xl">
            Үйлчилгээний нөхцөл
          </h1>
          <div className="space-y-5 text-sm font-medium leading-7 text-[#5b4a87]">
            <p>
              Mon1.mn платформыг ашигласнаар та энэхүү үйлчилгээний нөхцөлийг
              хүлээн зөвшөөрсөнд тооцно.
            </p>
            <p>
              Хэрэглэгч бүр нийтэлж буй зарын мэдээллийн үнэн зөв байдалд
              хариуцлага хүлээнэ. Буруу, хуурамч болон гутаан доромжилсон
              мэдээлэл оруулахыг хориглоно.
            </p>
            <p>
              Платформын хэвийн ажиллагааг алдагдуулах, хууль бус зорилгоор
              ашиглах үйлдэл илэрсэн тохиолдолд хэрэглэгчийн эрхийг түр болон
              бүр мөсөн хаах эрх Mon1.mn-д хадгалагдана.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
