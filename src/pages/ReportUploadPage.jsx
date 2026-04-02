import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import { reportService } from "../services/reportService";

function ReportUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [failedFile, setFailedFile] = useState(null);

  const fileType = useMemo(() => selectedFile?.type || "", [selectedFile]);
  const isImage = fileType.startsWith("image/");

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFailedFile(null);
    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  const upload = async (fileToUpload) => {
    if (!fileToUpload) return;

    setUploading(true);

    try {
      await reportService.uploadReport(fileToUpload, { reportType: "DONATION_REPORT" });
      toast.success("Report uploaded successfully");
      setSelectedFile(null);
      setFailedFile(null);
      setPreviewUrl("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed. Please retry.");
      setFailedFile(fileToUpload);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-2xl font-bold text-medical-900">Upload Medical Reports</h1>
        <p className="text-sm text-slate-600">Upload and preview reports before sharing with the hospital admin.</p>
      </section>

      <section className="card mt-6 p-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">Choose report file</label>
        <input type="file" onChange={onFileChange} className="input" accept="image/*,application/pdf" />

        {!selectedFile && (
          <div className="mt-5">
            <EmptyState title="No file selected" description="Upload a PDF or image report to continue." />
          </div>
        )}

        {selectedFile && (
          <div className="mt-5 rounded-xl border border-medical-100 bg-medical-50 p-4">
            <p className="text-sm font-semibold text-slate-800">{selectedFile.name}</p>
            <p className="text-xs text-slate-500">{Math.round(selectedFile.size / 1024)} KB</p>

            {isImage && previewUrl && (
              <img src={previewUrl} alt="Report preview" className="mt-4 max-h-80 rounded-xl border border-medical-100 object-contain" />
            )}

            {!isImage && (
              <p className="mt-3 text-xs text-slate-500">Preview not available for this file type.</p>
            )}

            <button
              type="button"
              disabled={uploading}
              onClick={() => upload(selectedFile)}
              className="btn-primary mt-4"
            >
              {uploading ? "Uploading..." : "Upload Report"}
            </button>
          </div>
        )}

        {failedFile && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Upload failed for {failedFile.name}.{" "}
            <button type="button" className="font-semibold underline" onClick={() => upload(failedFile)}>
              Retry now
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default ReportUploadPage;
