import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, Type } from "../backend";
import { useActor } from "../hooks/useActor";
import { useCreateSpot } from "../hooks/useQueries";
import { useLang } from "../i18n";

export function RegisterSpotPage() {
  const { t } = useLang();
  const createSpot = useCreateSpot();
  const { actor } = useActor();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotoFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Erro de ligação. Tente novamente.");
      return;
    }
    setUploading(true);
    try {
      const photos: ExternalBlob[] = [];
      for (const file of photoFiles) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        photos.push(ExternalBlob.fromBytes(bytes));
      }
      await createSpot.mutateAsync({
        name,
        description,
        category: category as Type,
        location,
        isPrivate,
        photos,
      });
      toast.success(t.registerSpot.success);
      setName("");
      setDescription("");
      setCategory("");
      setLocation("");
      setIsPrivate(false);
      setPhotoFiles([]);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <h1
        className="font-display text-4xl font-bold text-foreground mb-8"
        data-ocid="registerspot.section"
      >
        {t.registerSpot.title}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-2xl p-8 shadow-card space-y-6 border border-border"
        data-ocid="registerspot.panel"
      >
        <div>
          <Label htmlFor="spotName">{t.registerSpot.name}</Label>
          <Input
            id="spotName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            data-ocid="registerspot.input"
          />
        </div>
        <div>
          <Label htmlFor="spotDesc">{t.registerSpot.description}</Label>
          <Textarea
            id="spotDesc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            data-ocid="registerspot.textarea"
          />
        </div>
        <div>
          <Label>{t.registerSpot.category}</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-ocid="registerspot.select">
              <SelectValue placeholder={t.registerSpot.category} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Type.nature}>{t.spots.nature}</SelectItem>
              <SelectItem value={Type.beach}>{t.spots.beach}</SelectItem>
              <SelectItem value={Type.historical}>
                {t.spots.historical}
              </SelectItem>
              <SelectItem value={Type.museum}>{t.spots.museum}</SelectItem>
              <SelectItem value={Type.city}>{t.spots.city}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="spotLocation">{t.registerSpot.location}</Label>
          <Input
            id="spotLocation"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            data-ocid="registerspot.input"
          />
        </div>

        {/* Private spot toggle */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="spotPrivate"
              checked={isPrivate}
              onCheckedChange={(v) => setIsPrivate(!!v)}
              data-ocid="registerspot.checkbox"
            />
            <Label
              htmlFor="spotPrivate"
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-purple-600" />
              Ponto Privado
            </Label>
          </div>

          {isPrivate && (
            <div className="flex items-start gap-3 rounded-xl border-2 border-accent bg-accent/10 px-5 py-4">
              <AlertCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-accent text-sm">
                  Taxa de listagem para ponto privado
                </p>
                <p className="text-sm text-foreground mt-0.5">
                  Pontos turísticos privados estão sujeitos a uma taxa de
                  plataforma de{" "}
                  <span className="font-bold text-accent">25.000 AOA</span>. O
                  pagamento será solicitado após aprovação do seu registo.
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="spotPhotos">{t.registerSpot.photos}</Label>
          <input
            id="spotPhotos"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-navy file:text-cream file:font-medium hover:file:bg-navy/90 cursor-pointer"
            data-ocid="registerspot.upload_button"
          />
          {photoFiles.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {photoFiles.length} foto(s) selecionada(s)
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-orange hover:bg-orange/90 text-white h-11"
          disabled={createSpot.isPending || uploading || !category}
          data-ocid="registerspot.submit_button"
        >
          {createSpot.isPending || uploading
            ? "Enviando..."
            : t.registerSpot.submit}
        </Button>
      </form>
    </main>
  );
}
