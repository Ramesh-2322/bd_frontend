import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { reportService } from "../services/reportService";

function UploadReports() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  useEffect(() => {
    const loadReports = async () => {
      setLoadingList(true);
      try {
        const data = await reportService.getMyReports();
        setUploadedFiles(data || []);
      } catch {
        setUploadedFiles([]);
      } finally {
        setLoadingList(false);
      }
    };

    loadReports();
  }, []);


  const isImage = useMemo(() => (selectedFile?.type || "").startsWith("image/"), [selectedFile]);

  const onSelectFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    try {
      const response = await reportService.uploadReport(selectedFile);
      setUploadedFiles((prev) => [
        {
          id: response?.id || `${selectedFile.name}-${Date.now()}`,
          fileName: response?.fileName || selectedFile.name,
          fileType: response?.fileType || selectedFile.type,
          uploadedAt: response?.uploadedAt || new Date().toISOString(),
        },
        ...prev,
      ]);
      toast.success("Report uploaded successfully");
      setSelectedFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-medical-800 dark:text-medical-300">Upload Reports</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Upload PDF or image reports.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Upload File</label>
            <input className="input" type="file" accept="application/pdf,image/*" onChange={onSelectFile} />

            {selectedFile && (
              <div className="mt-3 rounded-xl border border-medical-100 bg-medical-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="font-semibold text-slate-700 dark:text-slate-200">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{Math.ceil(selectedFile.size / 1024)} KB</p>
                {!isImage && <p className="mt-1 text-xs text-slate-500">PDF preview is not available.</p>}
              </div>
            )}

            <button type="button" onClick={uploadFile} disabled={uploading} className="btn-primary mt-4">
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Uploaded Files</h2>
            <div className="mt-2 max-h-64 overflow-auto rounded-xl border border-medical-100 dark:border-slate-800">
              {loadingList ? (
                <LoadingSpinner text="Loading uploaded files" />
              ) : uploadedFiles.length === 0 ? (
                <div className="p-3">
                  <EmptyState title="No files uploaded" description="Uploaded reports will appear here." />
                </div>
              ) : (
                <ul className="divide-y divide-medical-100 dark:divide-slate-800">
                  {uploadedFiles.map((file) => (
                    <li key={file.id} className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-100">{file.fileName}</p>
                      <p className="text-xs text-slate-500">
                        {file.fileType || "Unknown type"} • {new Date(file.uploadedAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UploadReports;
