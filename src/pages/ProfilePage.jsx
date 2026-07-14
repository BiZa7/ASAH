import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LogOut,
  RefreshCw,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import { authService } from "../services/authService";
import { psikotesService } from "../services/psikotesService";
import { userService } from "../services/userService";
import "./ProfilePage.css";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const cachedUser = authService.getCurrentUser();
  const [profile, setProfile] = useState(cachedUser || {});
  const [form, setForm] = useState({
    name: cachedUser?.name || "",
    image: cachedUser?.image || "",
    birth_date: cachedUser?.birth_date || "",
    gender_type: cachedUser?.gender_type || "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const avatarUrl = useMemo(() => {
    if (form.image) return form.image;
    const name = encodeURIComponent(form.name || profile.email || "User");
    return `https://ui-avatars.com/api/?name=${name}&background=E8F4F8&color=2C5F6F&size=128`;
  }, [form.image, form.name, profile.email]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await userService.getProfile();
        const nextProfile = response.data || {};

        setProfile(nextProfile);
        setForm({
          name: nextProfile.name || "",
          image: nextProfile.image || "",
          birth_date: nextProfile.birth_date || "",
          gender_type: nextProfile.gender_type || "",
        });
        authService.saveUser(nextProfile);
      } catch (err) {
        setError(err.message || "Gagal memuat profil.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        name: form.name,
        image: form.image,
        birth_date: form.birth_date || null,
        gender_type: form.gender_type || null,
      };
      const response = await userService.updateProfile(payload);
      const nextProfile = response.data;

      setProfile(nextProfile);
      authService.saveUser(nextProfile);
      setMessage("Profil berhasil diperbarui.");
    } catch (err) {
      setError(err.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleRetake = async () => {
    const confirmed = window.confirm(
      "Mulai psikotes ulang? Hasil psikotes, rekomendasi karier, dan roadmap lama akan dibersihkan.",
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      await psikotesService.startRetake();
      navigate("/psikotes");
    } catch (err) {
      setError(err.message || "Gagal memulai psikotes ulang.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Hapus akun ini? Semua data yang terhubung dengan akun akan dihapus.",
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      await userService.deleteProfile();
      authService.logout();
      navigate("/");
    } catch (err) {
      setError(err.message || "Gagal menghapus akun.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-shell">
          <div className="profile-loading">Memuat profil...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <button className="profile-back" type="button" onClick={() => navigate("/roadmap")}>
          <ArrowLeft size={18} />
          Kembali ke Course
        </button>

        <section className="profile-layout">
          <aside className="profile-summary">
            <img className="profile-avatar-large" src={avatarUrl} alt="Foto profil" />
            <h1>{profile.name || "User ASAH"}</h1>
            <p>{profile.email}</p>
            <div className="profile-meta">
              <span>{profile.role || "user"}</span>
              <span>{profile.gender_type || "Belum diisi"}</span>
            </div>
          </aside>

          <section className="profile-panel">
            <div className="profile-panel-header">
              <div>
                <h2>Profil Saya</h2>
                <p>Kelola data dasar akun dan asesmen psikotes kamu.</p>
              </div>
              <UserRound size={28} />
            </div>

            {message && <div className="profile-alert success">{message}</div>}
            {error && <div className="profile-alert error">{error}</div>}

            <form className="profile-form" onSubmit={handleSubmit}>
              <label>
                Nama
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama lengkap"
                  required
                />
              </label>

              <label>
                Email
                <input value={profile.email || ""} disabled />
              </label>

              <label>
                URL Foto Profil
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </label>

              <div className="profile-form-grid">
                <label>
                  Tanggal Lahir
                  <input
                    name="birth_date"
                    type="date"
                    value={form.birth_date || ""}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Gender
                  <select
                    name="gender_type"
                    value={form.gender_type || ""}
                    onChange={handleChange}
                  >
                    <option value="">Belum diisi</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>

              <div className="profile-actions">
                <button className="profile-primary" type="submit" disabled={saving}>
                  <Save size={18} />
                  {saving ? "Menyimpan..." : "Simpan Profil"}
                </button>
                <button className="profile-secondary" type="button" onClick={handleRetake} disabled={saving}>
                  <RefreshCw size={18} />
                  Psikotes Ulang
                </button>
              </div>
            </form>

            <div className="profile-danger-zone">
              <button type="button" onClick={handleLogout} disabled={saving}>
                <LogOut size={18} />
                Logout
              </button>
              <button type="button" className="danger" onClick={handleDeleteAccount} disabled={saving}>
                <Trash2 size={18} />
                Hapus Akun
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};
