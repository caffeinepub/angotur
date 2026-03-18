import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateGuide } from "../hooks/useQueries";
import { useLang } from "../i18n";

export function RegisterGuidePage() {
  const { t } = useLang();
  const createGuide = useCreateGuide();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { actor } = useActor();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const isLoggedIn = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !identity) {
      toast.error("Precisa de fazer login para se registar como guia.");
      return;
    }
    setUploading(true);
    try {
      // Auto-register user profile if needed
      try {
        await actor.saveCallerUserProfile({
          name: identity.getPrincipal().toString(),
        });
      } catch {
        // Ignore if already registered
      }

      let profilePhoto: ExternalBlob | undefined;
      if (photoFile) {
        const bytes = new Uint8Array(await photoFile.arrayBuffer());
        profilePhoto = ExternalBlob.fromBytes(bytes);
      }
      const langs = languages
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);
      await createGuide.mutateAsync({
        name,
        bio,
        languages: langs,
        pricePerDay: BigInt(Math.round(Number(price) || 0)),
        available,
        profilePhoto,
      });
      toast.success(t.registerGuide.success);
      setName("");
      setBio("");
      setLanguages("");
      setPrice("");
      setPhotoFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">
          {t.registerGuide.title}
        </h1>
        <div className="bg-card rounded-2xl p-10 shadow-card border border-border flex flex-col items-center gap-6 text-center">
          <LogIn className="w-14 h-14 text-orange" />
          <div>
            <p className="text-lg font-semibold text-foreground mb-2">
              Login necessário
            </p>
            <p className="text-muted-foreground">
              Para se registar como guia turístico, precisa de iniciar sessão
              com a sua Internet Identity.
            </p>
          </div>
          <Button
            className="bg-orange hover:bg-orange/90 text-white px-8"
            onClick={() => login()}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "A iniciar sessão..." : "Iniciar Sessão"}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <h1
        className="font-display text-4xl font-bold text-foreground mb-6"
        data-ocid="registerguide.section"
      >
        {t.registerGuide.title}
      </h1>

      {/* Fee notice */}
      <div
        className="flex items-start gap-3 rounded-xl border-2 border-accent bg-accent/10 px-5 py-4 mb-8"
        data-ocid="registerguide.panel"
      >
        <AlertCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-accent text-sm">
            Taxa de listagem na plataforma
          </p>
          <p className="text-sm text-foreground mt-0.5">
            Para ser listado como guia turístico no Angotur, é cobrada uma taxa
            de plataforma de{" "}
            <span className="font-bold text-accent">15.000 AOA</span>. O
            pagamento será solicitado após aprovação do seu registo.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-2xl p-8 shadow-card space-y-6 border border-border"
      >
        <div>
          <Label htmlFor="guideName">{t.registerGuide.name}</Label>
          <Input
            id="guideName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            data-ocid="registerguide.input"
          />
        </div>
        <div>
          <Label htmlFor="guideBio">{t.registerGuide.bio}</Label>
          <Textarea
            id="guideBio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            rows={4}
            data-ocid="registerguide.textarea"
          />
        </div>
        <div>
          <Label htmlFor="guideLangs">{t.registerGuide.languages}</Label>
          <Input
            id="guideLangs"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            placeholder="Português, English, Français"
            required
            data-ocid="registerguide.input"
          />
        </div>
        <div>
          <Label htmlFor="guidePrice">{t.registerGuide.price}</Label>
          <Input
            id="guidePrice"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            data-ocid="registerguide.input"
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch
            id="guideAvailable"
            checked={available}
            onCheckedChange={setAvailable}
            data-ocid="registerguide.switch"
          />
          <Label htmlFor="guideAvailable">
            {available ? t.guides.available : t.guides.unavailable}
          </Label>
        </div>
        <div>
          <Label htmlFor="guidePhoto">{t.registerGuide.photo}</Label>
          <input
            id="guidePhoto"
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-navy file:text-cream file:font-medium hover:file:bg-navy/90 cursor-pointer"
            data-ocid="registerguide.upload_button"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-orange hover:bg-orange/90 text-white h-11"
          disabled={createGuide.isPending || uploading}
          data-ocid="registerguide.submit_button"
        >
          {createGuide.isPending || uploading
            ? "Enviando..."
            : t.registerGuide.submit}
        </Button>
      </form>
    </main>
  );
}
