import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Home,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-background">Mon1.mn</span>
            </Link>
            <p className="text-background/70 text-sm mb-4">
              Монголын хамгийн том үл хөдлөх хөрөнгийн платформ. Баталгаажсан
              зар, итгэлтэй агентуудтай хамтран мөрөөдлийн гэрээ олоорой.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Хурдан холбоос</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/listings"
                  className="text-background/70 hover:text-background text-sm transition-colors"
                >
                  Зарууд үзэх
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="text-background/70 hover:text-background text-sm transition-colors"
                >
                  Газрын зураг
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="text-background/70 hover:text-background text-sm transition-colors"
                >
                  Агент хайх
                </Link>
              </li>
              <li>
                <Link
                  href="/add-property"
                  className="text-background/70 hover:text-background text-sm transition-colors"
                >
                  Зар нэмэх
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Байрны төрөл</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/listings?type=apartment"
                  className="text-background/70 hover:text-background text-sm transition-colors"
                >
                  Орон сууц
                </Link>
              </li>
              <li>
                <Link
                  href="/listings?type=house"
                  className="text-background/70 hover:text-background text-sm transition-colors"
                >
                  Хашаа байшин
                </Link>
              </li>
              <li>
                <Link
                  href="/listings?type=studio"
                  className="text-background/70 hover:text-background text-sm transition-colors"
                >
                  Студио
                </Link>
              </li>
              <li>
                <Link
                  href="/listings?type=penthouse"
                  className="text-background/70 hover:text-background text-sm transition-colors"
                >
                  Пентхаус
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Холбоо барих</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Энхтайвны өргөн чөлөө 15, Улаанбаатар</span>
              </li>
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+976 7000 1234</span>
              </li>
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@mon1.mn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/50 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Mon1.mn. Бүх эрх хуулиар
            хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
}
