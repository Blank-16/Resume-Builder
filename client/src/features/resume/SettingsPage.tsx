import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Lock, Trash2, Save, FileText } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppStore";
import { setUser, logout } from "@/store/features/authSlice";
import { userApi } from "@/services/api";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import toast from "react-hot-toast";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user     = useAppSelector((s) => s.auth.user);

  const [profileForm, setProfileForm] = useState({ name: user?.name ?? "", email: user?.email ?? "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [deletePassword, setDeletePassword] = useState("");
  const [savingProfile,  setSavingProfile]  = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profileForm.name.trim() && !profileForm.email.trim()) return;
    setSavingProfile(true);
    try {
      const { data } = await userApi.updateProfile(profileForm);
      if (data.data) {
        dispatch(setUser(data.data));
        toast.success("Profile updated");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      await userApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword:     passwordForm.newPassword,
      });
      toast.success("Password changed");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setDeletingAccount(true);
    try {
      await userApi.deleteAccount({ password: deletePassword });
      dispatch(logout());
      navigate("/");
      toast.success("Account deleted");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete account");
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-subtle)" }}>
      {showDeleteModal && (
        <ConfirmModal
          title="Delete your account"
          message="This permanently deletes your account and all resumes. This cannot be undone."
          confirmLabel="Delete my account"
          danger
          onConfirm={() => void handleDeleteAccount()}
          onCancel={() => { setShowDeleteModal(false); setDeletePassword(""); }}
        />
      )}

      {/* Header */}
      <header style={{
        background: "var(--surface)", borderBottom: "1px solid var(--border)",
        padding: "0 1.5rem", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Link to="/dashboard" className="btn btn-surface flex items-center gap-1.5 text-xs px-3 py-1.5">
            <ArrowLeft className="size-3.5" /> Dashboard
          </Link>
          <span style={{ color: "var(--border-strong)" }}>|</span>
          <div className="flex items-center gap-2">
            <FileText className="size-4" style={{ color: "var(--accent-text)" }} />
            <h1 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Account Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10 space-y-6">

        {/* Profile */}
        <div className="card-raised overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2">
              <User className="size-4" style={{ color: "var(--accent-text)" }} />
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Profile</h2>
            </div>
          </div>
          <form onSubmit={(e) => void handleSaveProfile(e)} className="p-6 space-y-4">
            <div>
              <label className="label">Name</label>
              <input type="text" value={profileForm.name} className="input"
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={profileForm.email} className="input"
                onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <button type="submit" disabled={savingProfile}
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm">
              {savingProfile ? <span className="spinner" /> : <Save className="size-4" />}
              {savingProfile ? "Saving…" : "Save Profile"}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="card-raised overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2">
              <Lock className="size-4" style={{ color: "var(--accent-text)" }} />
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Change Password</h2>
            </div>
          </div>
          <form onSubmit={(e) => void handleChangePassword(e)} className="p-6 space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input type="password" autoComplete="current-password" value={passwordForm.currentPassword}
                className="input" onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} />
            </div>
            <div>
              <label className="label">New Password</label>
              <input type="password" autoComplete="new-password" minLength={8} value={passwordForm.newPassword}
                className="input" placeholder="Min. 8 characters"
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input type="password" autoComplete="new-password" value={passwordForm.confirmPassword}
                className="input"
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} />
            </div>
            <button type="submit" disabled={savingPassword}
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm">
              {savingPassword ? <span className="spinner" /> : <Lock className="size-4" />}
              {savingPassword ? "Saving…" : "Change Password"}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="card-raised overflow-hidden" style={{ borderColor: "var(--danger)" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)", background: "var(--danger-dim)" }}>
            <div className="flex items-center gap-2">
              <Trash2 className="size-4" style={{ color: "var(--danger)" }} />
              <h2 className="text-sm font-semibold" style={{ color: "var(--danger)" }}>Danger Zone</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Permanently delete your account and all resume data. Enter your password to confirm.
            </p>
            <input type="password" value={deletePassword} className="input"
              placeholder="Enter your password to confirm"
              onChange={(e) => setDeletePassword(e.target.value)} />
            <button type="button"
              disabled={!deletePassword.trim() || deletingAccount}
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-danger flex items-center gap-2 px-4 py-2 text-sm">
              <Trash2 className="size-4" /> Delete my account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
