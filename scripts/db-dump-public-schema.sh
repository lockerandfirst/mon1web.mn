#!/usr/bin/env bash
# D: public schema-г SQL болгон татах.
# Хамгийн найдвартай: .env-д SUPABASE_DB_URL + системд pg_dump (brew install libpq).
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

OUT="supabase/migrations/$(date +%Y%m%d%H%M%S)_remote_public_schema.sql"

if [[ -n "${SUPABASE_DB_URL:-}" ]]; then
  if command -v pg_dump >/dev/null 2>&1; then
    echo "SUPABASE_DB_URL + pg_dump (Docker шаардлагагүй)…"
    pg_dump "$SUPABASE_DB_URL" \
      --schema=public \
      --schema-only \
      --no-owner \
      --no-privileges \
      -f "$OUT"
  else
    echo "SUPABASE_DB_URL байна, гэхдээ pg_dump олдсонгүй — Supabase CLI (Docker шаардлагатай)…"
    echo "  macOS: brew install libpq && echo 'export PATH=\"/opt/homebrew/opt/libpq/bin:\$PATH\"' >> ~/.zshrc"
    npx --yes supabase@latest db dump --db-url "$SUPABASE_DB_URL" --schema public -f "$OUT" || {
      echo ""
      echo "Алдаа: Docker эсвэл DNS. Шалгах:"
      echo "  • Dashboard → Database → URI-г Session pooler (pooler.supabase.com) эсвэл Direct-ээс бүрэн хууна."
      echo "  • db.PROJECT_REF.supabase.co зарим орчинд DNS-ээр олдохгүй — Dashboard-ийн URI-г ашиглана."
      echo "  • pg_dump суулгаад дахин ажиллуул: brew install libpq"
      exit 1
    }
  fi
else
  echo "SUPABASE_DB_URL байхгүй — linked dump (Docker шаардлагатай)…"
  if ! npx --yes supabase@latest db dump --linked --schema public -f "$OUT"; then
    echo ""
    echo "Алдаа: Docker daemon эсвэл SUPABASE_DB_URL дутуу."
    echo "  1) Docker Desktop асаа, эсвэл"
    echo "  2) .env-д SUPABASE_DB_URL (Dashboard → Database → Connection string) + brew install libpq"
    exit 1
  fi
fi

echo "Бичигдсэн: $OUT — шалгаад шаардлагатай бол нэр засаж commit хийнэ үү."
