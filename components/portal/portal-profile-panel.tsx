"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { ImagePlus, Mail, Phone, Save, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SafeImage } from "@/components/ui/safe-image";
import { apiFetch, API_BASE_URL } from "@/lib/backend-api";
import { AVATAR_IMAGE_FALLBACK } from "@/lib/image-fallbacks";
import { ProfileTabSkeleton } from "@/components/portal/agent-portal-tab-skeleton";

type AgentProfileDto = {
  id: string;
  profileId: string | null;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  bio: string;
};

const AGENT_PROFILE_CACHE_KEY = "portal-agent-profile-v2";

export function PortalProfilePanel() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isLoaded) {
    return <ProfileTabSkeleton />;
  }

  const fallbackName = "Агент";
  const fallbackEmail = "";
  const avatarPreview = useMemo(() => {
    return avatar?.trim() || AVATAR_IMAGE_FALLBACK;
  }, [avatar, name, fallbackName]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const raw = window.sessionStorage.getItem(AGENT_PROFILE_CACHE_KEY);
      if (!raw) return;
      const cached = JSON.parse(raw) as AgentProfileDto;
      setProfileId(cached.profileId);
      setEmail(cached.email || "");
      setName(cached.name || fallbackName);
      setPhone(cached.phone || "");
      setBio(cached.bio || "");
      setAvatar(cached.avatar || "");
    } catch {
      // ignore stale cache
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) return;
        const res = await apiFetch<{ success: boolean; data: AgentProfileDto }>(
          "/api/agents/me",
          { token },
        );
        if (cancelled) return;
        setProfileId(res.data.profileId);
        setEmail(res.data.email || fallbackEmail);
        setName(res.data.name || fallbackName);
        setPhone(res.data.phone || "");
        setBio(res.data.bio || "");
        setAvatar(res.data.avatar || "");
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(
            AGENT_PROFILE_CACHE_KEY,
            JSON.stringify(res.data),
          );
        }
      } catch {
        if (!cancelled) {
          setError("Профайл татахад алдаа гарлаа.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const onSave = async () => {
    setError(null);
    setSuccess(null);
    if (!name.trim()) {
      setError("Нэр хоосон байж болохгүй.");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) {
        setError("Нэвтэрнэ үү.");
        return;
      }
      const res = await apiFetch<{ success: boolean; data: AgentProfileDto }>(
        "/api/agents/me",
        {
          method: "PATCH",
          token,
          body: {
            name: name.trim(),
            phone: phone.trim(),
            bio: bio.trim(),
            ...(avatar.trim() ? { avatar: avatar.trim() } : {}),
          },
        },
      );
      setProfileId(res.data.profileId);
      setName(res.data.name || "");
      setPhone(res.data.phone || "");
      setBio(res.data.bio || "");
      setAvatar(res.data.avatar || "");
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          AGENT_PROFILE_CACHE_KEY,
          JSON.stringify(res.data),
        );
      }
      setSuccess("Профайл хадгалагдлаа.");
    } catch (e) {
      if (e instanceof Error) {
        try {
          const parsed = JSON.parse(e.message) as { error?: string };
          setError(parsed.error ?? "Хадгалах үед алдаа гарлаа.");
        } catch {
          setError("Хадгалах үед алдаа гарлаа.");
        }
      } else {
        setError("Хадгалах үед алдаа гарлаа.");
      }
    } finally {
      setSaving(false);
    }
  };

  const onAvatarPick = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setSuccess(null);
    setUploadingAvatar(true);
    try {
      const token = await getToken();
      if (!token) {
        setError("Нэвтэрнэ үү.");
        return;
      }
      const form = new FormData();
      form.append("avatar", file);
      const response = await fetch(
        `${API_BASE_URL}/api/agents/me/avatar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        },
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Avatar upload failed");
      }
      const res = (await response.json()) as {
        success: boolean;
        data: AgentProfileDto;
      };
      setAvatar(res.data.avatar || "");
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          AGENT_PROFILE_CACHE_KEY,
          JSON.stringify({
            id: res.data.id,
            profileId: profileId,
            name,
            email,
            phone,
            bio,
            avatar: res.data.avatar || "",
          }),
        );
      }
      setSuccess("Профайл зураг шинэчлэгдлээ.");
    } catch (e) {
      if (e instanceof Error) {
        try {
          const parsed = JSON.parse(e.message) as { error?: string };
          setError(parsed.error ?? "Зураг upload хийхэд алдаа гарлаа.");
        } catch {
          setError("Зураг upload хийхэд алдаа гарлаа.");
        }
      } else {
        setError("Зураг upload хийхэд алдаа гарлаа.");
      }
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_24px_60px_-28px_rgba(42, 0, 255,0.15)]">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <SafeImage
          src={avatarPreview}
          variant="avatar"
          alt={name || fallbackName}
          className="h-20 w-20 rounded-full border border-slate-200 object-cover shadow-sm"
        />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#ff3bad]">
            Профайл
          </p>
          <h2 className="text-2xl font-black tracking-tight text-[#1a0b3b]">
            {name || fallbackName}
          </h2>
          {profileId ? (
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              profile_id: {profileId}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Мэдээлэл татаж байна
            </p>
            <div className="space-y-2">
              <div className="h-10 animate-pulse rounded-xl bg-white" />
              <div className="h-10 animate-pulse rounded-xl bg-white" />
              <div className="h-24 animate-pulse rounded-xl bg-white" />
            </div>
          </div>
        ) : null}
        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
            {success}
          </p>
        ) : null}
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#ff3bad]">
            Профайл зураг
          </p>
          <SafeImage
            src={avatarPreview}
            variant="avatar"
            alt={name || fallbackName}
            className="mb-3 h-20 w-20 rounded-2xl border border-slate-200 object-cover"
          />
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void onAvatarPick(e.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-slate-300 bg-white font-bold text-slate-700"
              disabled={uploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              {uploadingAvatar ? "Upload..." : "Зураг оруулах"}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-3xl bg-[#f8f6ff] px-4 py-3">
          <User className="h-5 w-5 shrink-0 text-[#2a00ff]" />
          <div className="min-w-0 text-left">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#ff3bad]">
              Нэр
            </p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-9 rounded-xl border-none bg-white font-bold text-[#1a0b3b]"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-3xl bg-[#fff9fd] px-4 py-3">
          <Phone className="h-5 w-5 shrink-0 text-[#2a00ff]" />
          <div className="min-w-0 text-left">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#ff3bad]">
              Утас
            </p>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+976 ..."
              className="mt-1 h-9 rounded-xl border-none bg-white font-bold text-[#1a0b3b]"
            />
          </div>
        </div>
        {email ? (
          <div className="flex items-center gap-3 rounded-3xl bg-[#fff9fd] px-4 py-3">
            <Mail className="h-5 w-5 shrink-0 text-[#2a00ff]" />
            <div className="min-w-0 text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#ff3bad]">
                И-мэйл
              </p>
              <p className="truncate font-bold text-[#1a0b3b]">{email}</p>
            </div>
          </div>
        ) : null}
        <div className="rounded-3xl bg-[#f8f6ff] px-4 py-3">
          <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-[#ff3bad]">
            Bio
          </p>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Өөрийн танилцуулга..."
            className="min-h-24 rounded-2xl border-none bg-white font-semibold text-[#1a0b3b]"
          />
        </div>
        <Button
          type="button"
          onClick={() => void onSave()}
          disabled={saving || loading}
          className="h-11 w-full rounded-3xl bg-[#2a00ff] font-black text-white hover:bg-[#2200cf]"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Хадгалж байна..." : "Өөрчлөлт хадгалах"}
        </Button>
      </div>
    </div>
  );
}
