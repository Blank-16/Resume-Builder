import type { PersonalInfo } from "@/types";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

const FIELDS: { key: keyof PersonalInfo; label: string; type?: string; placeholder: string }[] = [
  { key: "fullName", label: "Full Name",    placeholder: "Jane Smith" },
  { key: "email",    label: "Email",        type: "email", placeholder: "jane@example.com" },
  { key: "phone",    label: "Phone",        type: "tel",   placeholder: "+1 555 000 0000" },
  { key: "location", label: "Location",     placeholder: "San Francisco, CA" },
  { key: "linkedin", label: "LinkedIn URL", type: "url",   placeholder: "https://linkedin.com/in/jane" },
  { key: "github",   label: "GitHub URL",   type: "url",   placeholder: "https://github.com/jane" },
  { key: "website",  label: "Website",      type: "url",   placeholder: "https://jane.dev" },
];

export function PersonalInfoForm({ data, onChange }: Props) {
  return (
    <fieldset className="space-y-4 border-none p-0 m-0">
      <legend className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Personal Information
      </legend>
      {FIELDS.map(({ key, label, type = "text", placeholder }, i) => (
        <div key={key} className="anim-fade-up" style={{ animationDelay: `${i * 35}ms` }}>
          <label htmlFor={`pi-${key}`} className="label">{label}</label>
          <input
            id={`pi-${key}`}
            type={type}
            value={data[key] ?? ""}
            onChange={(e) => onChange({ ...data, [key]: e.target.value })}
            placeholder={placeholder}
            className="input"
          />
        </div>
      ))}
    </fieldset>
  );
}
